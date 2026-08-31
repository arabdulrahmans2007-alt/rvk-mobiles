const { db } = require('../config/db');

// Get all products with filters
exports.getProducts = async (req, res) => {
  try {
    const { category, search, featured, sort } = req.query;
    let sql = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = 1
    `;
    const params = [];

    if (category && category !== 'all') {
      sql += ` AND (c.slug = ? OR c.name = ?)`;
      params.push(category, category);
    }

    if (search) {
      sql += ` AND (p.name LIKE ? OR p.description LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    if (featured === 'true' || featured === '1') {
      sql += ` AND p.is_featured = 1`;
    }

    if (sort === 'price-low') {
      sql += ` ORDER BY p.price ASC`;
    } else if (sort === 'price-high') {
      sql += ` ORDER BY p.price DESC`;
    } else if (sort === 'name') {
      sql += ` ORDER BY p.name ASC`;
    } else {
      sql += ` ORDER BY p.id DESC`;
    }

    const products = await db.all(sql, params);
    res.json({ success: true, count: products.length, products });
  } catch (err) {
    console.error('getProducts error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch products' });
  }
};

// Get categories
exports.getCategories = async (req, res) => {
  try {
    const sql = `
      SELECT c.*, COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.is_active = 1
      GROUP BY c.id
      ORDER BY c.id ASC
    `;
    const categories = await db.all(sql);
    res.json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
};

// Get single product
exports.getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const isNum = !isNaN(id);
    const sql = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE (p.id = ? OR p.slug = ?)
    `;
    const product = await db.get(sql, [isNum ? parseInt(id, 10) : id, id]);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch product' });
  }
};

// Admin Create Product
exports.createProduct = async (req, res) => {
  try {
    const { category_id, name, slug, description, price, original_price, stock_quantity, image_url, is_featured } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ success: false, message: 'Product name and price are required.' });
    }

    const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const result = await db.run(
      `INSERT INTO products (category_id, name, slug, description, price, original_price, stock_quantity, image_url, is_featured, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [
        category_id || 1,
        name.trim(),
        generatedSlug,
        description || '',
        parseFloat(price),
        original_price ? parseFloat(original_price) : null,
        stock_quantity !== undefined ? parseInt(stock_quantity, 10) : 50,
        image_url || '',
        is_featured ? 1 : 0
      ]
    );

    const product = await db.get("SELECT * FROM products WHERE id = ?", [result.lastInsertRowid]);
    res.status(201).json({ success: true, message: 'Product created successfully', product });
  } catch (err) {
    console.error('createProduct error:', err);
    res.status(500).json({ success: false, message: 'Failed to create product' });
  }
};

// Admin Update Product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_id, name, slug, description, price, original_price, stock_quantity, image_url, is_featured, is_active } = req.body;

    await db.run(
      `UPDATE products
       SET category_id = ?, name = ?, slug = ?, description = ?, price = ?, original_price = ?, stock_quantity = ?, image_url = ?, is_featured = ?, is_active = ?
       WHERE id = ?`,
      [
        category_id,
        name,
        slug,
        description,
        parseFloat(price),
        original_price ? parseFloat(original_price) : null,
        parseInt(stock_quantity, 10),
        image_url,
        is_featured ? 1 : 0,
        is_active !== undefined ? (is_active ? 1 : 0) : 1,
        id
      ]
    );

    const product = await db.get("SELECT * FROM products WHERE id = ?", [id]);
    res.json({ success: true, message: 'Product updated successfully', product });
  } catch (err) {
    console.error('updateProduct error:', err);
    res.status(500).json({ success: false, message: 'Failed to update product' });
  }
};

// Admin Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await db.run("DELETE FROM products WHERE id = ?", [id]);
    res.json({ success: true, message: 'Product removed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete product' });
  }
};