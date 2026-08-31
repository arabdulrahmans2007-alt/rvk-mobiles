const bcrypt = require('bcryptjs');
const { getDb, db, saveDb } = require('./config/db');

async function seed() {
  console.log('Seeding RVK MOBILES database...');
  await getDb();

  // 1. Seed Admin User
  const existingAdmin = await db.get("SELECT id FROM admins WHERE email = ?", ['admin@rvkmobiles.com']);
  if (!existingAdmin) {
    const passwordHash = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'Admin@RVK2026', 10);
    await db.run(
      "INSERT INTO admins (username, email, password_hash, full_name, role) VALUES (?, ?, ?, ?, ?)",
      ['admin', 'admin@rvkmobiles.com', passwordHash, 'Krishna Moorthy (Admin)', 'superadmin']
    );
    console.log('Admin account created: admin@rvkmobiles.com / Admin@RVK2026');
  }

  // 2. Seed Default Customer for testing
  const existingUser = await db.get("SELECT id FROM users WHERE email = ?", ['customer@rvk.com']);
  let testUserId = null;
  if (!existingUser) {
    const userPassHash = bcrypt.hashSync('Customer@123', 10);
    const res = await db.run(
      "INSERT INTO users (name, email, phone, password_hash, address, is_member) VALUES (?, ?, ?, ?, ?, ?)",
      ['Ramesh Kumar', 'customer@rvk.com', '9876543210', userPassHash, '12 Main Bazaar Road, Teppakulam, Trichy', 1]
    );
    testUserId = res.lastInsertRowid;
    console.log('Test customer created: customer@rvk.com / Customer@123');
  } else {
    testUserId = existingUser.id;
  }

  // 3. Seed Categories
  const categories = [
    { name: 'Audio & Wearables', slug: 'audio-wearables', description: 'Earphones, AirPods, neckbands and bluetooth speakers', icon: 'Headphones' },
    { name: 'Display & Screen Protection', slug: 'display-protection', description: 'Tempered glass, screen protectors and display modules', icon: 'Smartphone' },
    { name: 'Charging & Cables', slug: 'charging-cables', description: 'Fast chargers, USB cables and power adapters', icon: 'Zap' },
    { name: 'Holders & Mounts', slug: 'holders-mounts', description: 'Car mobile holders and desktop stands', icon: 'Compass' },
    { name: 'Power & Battery', slug: 'power-battery', description: 'Power banks and replacement batteries', icon: 'BatteryCharging' }
  ];

  for (const cat of categories) {
    const exists = await db.get("SELECT id FROM categories WHERE slug = ?", [cat.slug]);
    if (!exists) {
      await db.run(
        "INSERT INTO categories (name, slug, description, icon) VALUES (?, ?, ?, ?)",
        [cat.name, cat.slug, cat.description, cat.icon]
      );
    }
  }

  const audioCat = await db.get("SELECT id FROM categories WHERE slug = ?", ['audio-wearables']);
  const displayCat = await db.get("SELECT id FROM categories WHERE slug = ?", ['display-protection']);
  const chargingCat = await db.get("SELECT id FROM categories WHERE slug = ?", ['charging-cables']);
  const holdersCat = await db.get("SELECT id FROM categories WHERE slug = ?", ['holders-mounts']);

  // 4. Seed Products with strict confirmed prices
  const products = [
    {
      category_id: audioCat ? audioCat.id : 1,
      name: 'Earphone (Wired with Mic)',
      slug: 'earphone-wired-with-mic',
      description: 'Clear audio wired in-ear earphones with 3.5mm jack and inline microphone for crystal-clear calls and daily music.',
      price: 89,
      original_price: 149,
      stock_quantity: 150,
      image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
      is_featured: 1
    },
    {
      category_id: audioCat ? audioCat.id : 1,
      name: 'AirPods Wireless Earbuds',
      slug: 'airpods-wireless-earbuds',
      description: 'True wireless stereo earbuds with high-fidelity sound, ergonomic in-ear fit, and compact quick-charging case.',
      price: 699,
      original_price: 1299,
      stock_quantity: 80,
      image_url: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80',
      is_featured: 1
    },
    {
      category_id: audioCat ? audioCat.id : 1,
      name: 'Bluetooth Neckband Earphones',
      slug: 'bluetooth-neckband-earphones',
      description: 'Comfortable flexible wireless bluetooth neckband with magnetic earbuds, dynamic bass, and long-lasting playtime.',
      price: 599,
      original_price: 999,
      stock_quantity: 60,
      image_url: 'https://images.unsplash.com/photo-1578319439584-104c94d37305?w=600&auto=format&fit=crop&q=80',
      is_featured: 1
    },
    {
      category_id: audioCat ? audioCat.id : 1,
      name: 'Bluetooth Speaker (Mini Portable)',
      slug: 'bluetooth-speaker-mini',
      description: 'Ultra-portable mini bluetooth speaker with crisp acoustics, bass booster, and wireless connectivity.',
      price: 300,
      original_price: 499,
      stock_quantity: 45,
      image_url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=80',
      is_featured: 1
    },
    {
      category_id: audioCat ? audioCat.id : 1,
      name: 'Bluetooth Speaker (Boom Box)',
      slug: 'bluetooth-speaker-boom-box',
      description: 'High-output stereo bluetooth boom speaker with dual dynamic drivers, deep punchy bass, and rugged build.',
      price: 1200,
      original_price: 1800,
      stock_quantity: 30,
      image_url: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80',
      is_featured: 0
    },
    {
      category_id: audioCat ? audioCat.id : 1,
      name: 'Bluetooth Speaker (Party Master)',
      slug: 'bluetooth-speaker-party-master',
      description: 'Heavy-duty 40W bluetooth sound system with dual subwoofers, dynamic lighting, and multi-input support.',
      price: 3000,
      original_price: 4499,
      stock_quantity: 15,
      image_url: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=600&auto=format&fit=crop&q=80',
      is_featured: 1
    },
    {
      category_id: displayCat ? displayCat.id : 2,
      name: 'Premium Tempered Glass Screen Guard',
      slug: 'tempered-glass-screen-guard',
      description: 'Full-coverage transparent tempered screen protection for all popular smartphone models with smooth touch response.',
      price: 89,
      original_price: 199,
      stock_quantity: 300,
      image_url: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=600&auto=format&fit=crop&q=80',
      is_featured: 1
    },
    {
      category_id: chargingCat ? chargingCat.id : 3,
      name: '20W Rapid Fast Wall Charger',
      slug: '20w-rapid-fast-wall-charger',
      description: 'Compact 20W Power Delivery wall charger compatible with all modern smartphones for reliable high-speed charging.',
      price: 299,
      original_price: 499,
      stock_quantity: 90,
      image_url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80',
      is_featured: 0
    },
    {
      category_id: chargingCat ? chargingCat.id : 3,
      name: 'Braided Type-C Fast Data Cable',
      slug: 'braided-type-c-fast-data-cable',
      description: 'Durable nylon-braided USB-C fast charging and high-speed data transmission cable (1 Meter length).',
      price: 149,
      original_price: 249,
      stock_quantity: 120,
      image_url: 'https://images.unsplash.com/photo-1618478594486-c65b899c4936?w=600&auto=format&fit=crop&q=80',
      is_featured: 0
    },
    {
      category_id: holdersCat ? holdersCat.id : 4,
      name: 'Magnetic Car Air-Vent Mobile Holder',
      slug: 'magnetic-car-mobile-holder',
      description: 'Strong neodymium magnetic mount with 360-degree rotation for secure one-hand smartphone navigation in car.',
      price: 199,
      original_price: 349,
      stock_quantity: 50,
      image_url: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=600&auto=format&fit=crop&q=80',
      is_featured: 0
    }
  ];

  for (const prod of products) {
    const exists = await db.get("SELECT id FROM products WHERE slug = ?", [prod.slug]);
    if (!exists) {
      await db.run(
        "INSERT INTO products (category_id, name, slug, description, price, original_price, stock_quantity, image_url, is_featured, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)",
        [prod.category_id, prod.name, prod.slug, prod.description, prod.price, prod.original_price, prod.stock_quantity, prod.image_url, prod.is_featured]
      );
    }
  }

  // 5. Seed Offers
  const existingOffers = await db.all("SELECT id FROM offers");
  if (existingOffers.length === 0) {
    const todayStr = new Date().toISOString().split('T')[0];
    const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Today's Offer
    await db.run(
      "INSERT INTO offers (title, description, badge, original_price, offer_price, discount_text, target_service, start_date, end_date, is_active, is_todays_offer) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1)",
      [
        'LCD Display Replacement + Free Tempered Glass',
        'Book any smartphone LCD display replacement today and receive a complimentary high-clarity tempered screen guard installed on-site.',
        "TODAY'S SPECIAL",
        1399,
        999,
        'Save ₹400 Today',
        'Display Replacement',
        todayStr,
        nextMonth
      ]
    );

    // Additional Offers
    await db.run(
      "INSERT INTO offers (title, description, badge, original_price, offer_price, discount_text, target_service, start_date, end_date, is_active, is_todays_offer) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0)",
      [
        'AirPods Wireless Audio Fest',
        'Grab premium wireless AirPods with charging case at special festive price of only ₹699.',
        'HOT AUDIO DEAL',
        1299,
        699,
        'Flat ₹600 OFF',
        'Accessories',
        todayStr,
        nextMonth
      ]
    );

    await db.run(
      "INSERT INTO offers (title, description, badge, original_price, offer_price, discount_text, target_service, start_date, end_date, is_active, is_todays_offer) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0)",
      [
        'Doorstep Mobile Service — ₹0 Travel Charge',
        'Enjoy certified technician doorstep service within 20 KM radius in Trichy with ₹0 travel fee for all customers.',
        'ZERO TRAVEL FEE',
        200,
        0,
        'FREE TRAVEL',
        'Doorstep Service',
        todayStr,
        nextMonth
      ]
    );
  }

  // 6. Seed In-App Notifications
  const existingNotifs = await db.all("SELECT id FROM notifications");
  if (existingNotifs.length === 0) {
    await db.run(
      "INSERT INTO notifications (title, message, type, target_url, is_broadcast, is_read) VALUES (?, ?, ?, ?, 1, 0)",
      [
        '🔥 New Offer Available Today!',
        'Special LCD Display Replacement + Free Tempered Glass offer is now live for Trichy customers.',
        'offer',
        '/offers'
      ]
    );

    await db.run(
      "INSERT INTO notifications (title, message, type, target_url, is_broadcast, is_read) VALUES (?, ?, ?, ?, 1, 0)",
      [
        '🎁 Welcome to RVK MOBILES',
        'Explore verified accessories, display replacements, and doorstep service in Teppakulam Bazaar, Trichy.',
        'welcome',
        '/products'
      ]
    );

    await db.run(
      "INSERT INTO notifications (title, message, type, target_url, is_broadcast, is_read) VALUES (?, ?, ?, ?, 1, 0)",
      [
        '⚡ Doorstep Service Active',
        'Technician visit available within 20 KM with ₹0 travel fee. RVK Members get ₹0 travel at any distance!',
        'service',
        '/doorstep-service'
      ]
    );
  }

  // 7. Seed Settings
  const settings = [
    { key: 'store_name', value: 'RVK MOBILES', description: 'Business Store Name' },
    { key: 'owner_name', value: 'Krishna Moorthy', description: 'Business Owner' },
    { key: 'store_phone_1', value: '8610903892', description: 'Primary Contact Phone' },
    { key: 'store_phone_2', value: '8608103543', description: 'Secondary Contact Phone' },
    { key: 'store_address', value: 'Vanapatrai Kovil, Teppakulam Bazaar, Trichy', description: 'Store Location Address' },
    { key: 'store_city', value: 'Trichy', description: 'City' },
    { key: 'doorstep_radius_km', value: '20', description: 'Free travel radius for regular customers (KM)' },
    { key: 'doorstep_extra_km_rate', value: '10', description: 'Travel charge per extra KM beyond 20km for regular customers (₹)' },
    { key: 'warranty_policy', value: 'Warranty details available at the time of service.', description: 'Official warranty statement' },
    { key: 'working_hours', value: 'Monday – Sunday: 9:30 AM – 9:30 PM', description: 'Store opening hours' }
  ];

  for (const s of settings) {
    const exists = await db.get("SELECT key FROM settings WHERE key = ?", [s.key]);
    if (!exists) {
      await db.run(
        "INSERT INTO settings (key, value, description) VALUES (?, ?, ?)",
        [s.key, s.value, s.description]
      );
    }
  }

  // 8. Seed sample order and booking
  const existingOrders = await db.all("SELECT id FROM orders");
  if (existingOrders.length === 0 && testUserId) {
    const orderRes = await db.run(
      "INSERT INTO orders (order_number, user_id, customer_name, customer_email, customer_phone, delivery_address, total_amount, payment_method, payment_status, order_status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        'RVK-ORD-1001',
        testUserId,
        'Ramesh Kumar',
        'customer@rvk.com',
        '9876543210',
        '12 Main Bazaar Road, Teppakulam, Trichy',
        788,
        'Cash on Delivery',
        'Pending',
        'Processing',
        'Please deliver during evening hours.'
      ]
    );

    const orderId = orderRes.lastInsertRowid;
    await db.run(
      "INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity, subtotal) VALUES (?, ?, ?, ?, ?, ?)",
      [orderId, 2, 'AirPods Wireless Earbuds', 699, 1, 699]
    );
    await db.run(
      "INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity, subtotal) VALUES (?, ?, ?, ?, ?, ?)",
      [orderId, 1, 'Earphone (Wired with Mic)', 89, 1, 89]
    );

    // Create invoice
    await db.run(
      "INSERT INTO invoices (invoice_number, order_id, customer_name, total_amount, tax_amount, status) VALUES (?, ?, ?, ?, ?, ?)",
      ['INV-2026-001', orderId, 'Ramesh Kumar', 788, 0, 'Pending']
    );

    // Create sample display service booking
    await db.run(
      "INSERT INTO display_services (booking_code, user_id, customer_name, customer_phone, device_brand, device_model, display_type, estimated_price, service_type, address, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        'RVK-DSP-2026',
        testUserId,
        'Ramesh Kumar',
        '9876543210',
        'Redmi',
        'Note 11 Pro',
        'LCD Display',
        '₹999 - ₹1,399',
        'Doorstep',
        '12 Main Bazaar Road, Teppakulam, Trichy',
        'Confirmed',
        'Customer requested afternoon technician visit.'
      ]
    );

    // Create sample doorstep booking
    await db.run(
      "INSERT INTO doorstep_bookings (booking_code, user_id, customer_name, customer_phone, address, distance_km, is_rvk_member, preferred_date, preferred_time, problem_description, status, travel_charge) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        'RVK-DST-3001',
        testUserId,
        'Ramesh Kumar',
        '9876543210',
        '12 Main Bazaar Road, Teppakulam, Trichy',
        4.5,
        1,
        new Date().toISOString().split('T')[0],
        '04:00 PM',
        'Screen replacement and volume button check',
        'Confirmed',
        0
      ]
    );
  }

  console.log('Database seeding successfully finished!');
}

if (require.main === module) {
  seed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Seeding failed:', err);
      process.exit(1);
    });
}

module.exports = seed;