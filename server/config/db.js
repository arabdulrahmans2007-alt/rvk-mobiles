const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const DB_FILE = path.join(__dirname, '..', 'rvk.db');

let dbInstance = null;

async function getDb() {
  if (dbInstance) return dbInstance;

  const SQL = await initSqlJs();
  let buffer = null;

  if (fs.existsSync(DB_FILE)) {
    try {
      buffer = fs.readFileSync(DB_FILE);
      dbInstance = new SQL.Database(buffer);
    } catch (err) {
      console.warn('Could not read existing DB file, creating fresh DB:', err.message);
      dbInstance = new SQL.Database();
    }
  } else {
    dbInstance = new SQL.Database();
  }

  // Enable foreign keys
  dbInstance.run("PRAGMA foreign_keys = ON;");

  // Create tables if not exist
  initSchema(dbInstance);
  saveDb(dbInstance);

  return dbInstance;
}

function saveDb(db) {
  try {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_FILE, buffer);
  } catch (err) {
    console.error('Error saving database to disk:', err.message);
  }
}

function initSchema(db) {
  const schema = `
    -- 1. Users table
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      address TEXT,
      is_member INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 2. Admins table
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 3. Categories table
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      icon TEXT
    );

    -- 4. Products table
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      original_price REAL,
      stock_quantity INTEGER DEFAULT 50,
      image_url TEXT,
      is_featured INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
    );

    -- 5. Orders table
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_number TEXT UNIQUE NOT NULL,
      user_id INTEGER,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      delivery_address TEXT NOT NULL,
      total_amount REAL NOT NULL,
      payment_method TEXT DEFAULT 'Cash on Delivery',
      payment_status TEXT DEFAULT 'Pending',
      order_status TEXT DEFAULT 'Pending',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );

    -- 6. Order Items table
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER,
      product_name TEXT NOT NULL,
      unit_price REAL NOT NULL,
      quantity INTEGER NOT NULL,
      subtotal REAL NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
    );

    -- 7. Display Services table
    CREATE TABLE IF NOT EXISTS display_services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_code TEXT UNIQUE NOT NULL,
      user_id INTEGER,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      device_brand TEXT NOT NULL,
      device_model TEXT NOT NULL,
      display_type TEXT NOT NULL,
      estimated_price TEXT NOT NULL,
      service_type TEXT DEFAULT 'In-Store',
      address TEXT,
      status TEXT DEFAULT 'Pending',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );

    -- 8. Doorstep Bookings table
    CREATE TABLE IF NOT EXISTS doorstep_bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_code TEXT UNIQUE NOT NULL,
      user_id INTEGER,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      address TEXT NOT NULL,
      distance_km REAL DEFAULT 5,
      is_rvk_member INTEGER DEFAULT 0,
      preferred_date TEXT,
      preferred_time TEXT,
      problem_description TEXT,
      status TEXT DEFAULT 'Pending',
      travel_charge REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );

    -- 9. Memberships table
    CREATE TABLE IF NOT EXISTS memberships (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      plan_name TEXT DEFAULT 'RVK Elite Club',
      status TEXT DEFAULT 'Active',
      start_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      end_date DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- 10. Offers table
    CREATE TABLE IF NOT EXISTS offers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      badge TEXT DEFAULT 'SPECIAL DEAL',
      original_price REAL,
      offer_price REAL,
      discount_text TEXT,
      target_service TEXT,
      start_date TEXT,
      end_date TEXT,
      is_active INTEGER DEFAULT 1,
      is_todays_offer INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 11. Notifications table
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT DEFAULT 'offer',
      target_url TEXT,
      offer_id INTEGER,
      is_broadcast INTEGER DEFAULT 1,
      user_id INTEGER,
      is_read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (offer_id) REFERENCES offers(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- 12. Invoices table
    CREATE TABLE IF NOT EXISTS invoices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_number TEXT UNIQUE NOT NULL,
      order_id INTEGER NOT NULL,
      customer_name TEXT NOT NULL,
      total_amount REAL NOT NULL,
      tax_amount REAL DEFAULT 0,
      status TEXT DEFAULT 'Paid',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    );

    -- 13. Settings table
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      description TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Indexes for performance
    CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
    CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
    CREATE INDEX IF NOT EXISTS idx_display_booking_code ON display_services(booking_code);
    CREATE INDEX IF NOT EXISTS idx_doorstep_booking_code ON doorstep_bookings(booking_code);
    CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);
  `;

  db.exec(schema);
}

// Helper wrapper functions
class DBWrapper {
  static async all(sql, params = []) {
    const db = await getDb();
    const stmt = db.prepare(sql);
    stmt.bind(params);
    const results = [];
    while (stmt.step()) {
      results.push(stmt.getAsObject());
    }
    stmt.free();
    return results;
  }

  static async get(sql, params = []) {
    const db = await getDb();
    const stmt = db.prepare(sql);
    stmt.bind(params);
    let result = null;
    if (stmt.step()) {
      result = stmt.getAsObject();
    }
    stmt.free();
    return result;
  }

  static async run(sql, params = []) {
    const db = await getDb();
    const stmt = db.prepare(sql);
    stmt.bind(params);
    stmt.step();
    stmt.free();
    
    // Get last insert rowid and changes
    const idRes = db.exec("SELECT last_insert_rowid() as id, changes() as changes;");
    const lastId = idRes[0]?.values[0]?.[0] || null;
    const changes = idRes[0]?.values[0]?.[1] || 0;
    
    saveDb(db);
    return { lastInsertRowid: lastId, changes };
  }

  static async exec(sql) {
    const db = await getDb();
    db.exec(sql);
    saveDb(db);
  }
}

module.exports = {
  getDb,
  saveDb,
  db: DBWrapper
};