const { db } = require('../config/db');

// Customer Place Order
exports.createOrder = async (req, res) => {
  try {
    const { items, customer_name, customer_email, customer_phone, delivery_address, payment_method, notes } = req.body;

    if (!items || !items.length || !customer_name || !customer_phone || !delivery_address) {
      return res.status(400).json({ success: false, message: 'Please provide items and required delivery details.' });
    }

    let totalAmount = 0;
    const validatedItems = [];

    for (const item of items) {
      const prod = await db.get("SELECT id, name, price, stock_quantity FROM products WHERE id = ?", [item.id || item.product_id]);
      if (!prod) {
        return res.status(400).json({ success: false, message: `Product ID ${item.id} not found.` });
      }
      const qty = parseInt(item.quantity, 10) || 1;
      const subtotal = prod.price * qty;
      totalAmount += subtotal;
      validatedItems.push({
        product_id: prod.id,
        product_name: prod.name,
        unit_price: prod.price,
        quantity: qty,
        subtotal
      });
    }

    const orderNumber = `RVK-ORD-${Date.now().toString().slice(-6)}`;
    const userId = req.user ? req.user.id : null;

    const orderRes = await db.run(
      `INSERT INTO orders (order_number, user_id, customer_name, customer_email, customer_phone, delivery_address, total_amount, payment_method, payment_status, order_status, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', ?)`,
      [
        orderNumber,
        userId,
        customer_name.trim(),
        customer_email ? customer_email.trim() : 'guest@rvkmobiles.com',
        customer_phone.trim(),
        delivery_address.trim(),
        totalAmount,
        payment_method || 'Cash on Delivery',
        payment_method === 'Prepaid' ? 'Paid' : 'Pending',
        notes || ''
      ]
    );

    const orderId = orderRes.lastInsertRowid;

    for (const item of validatedItems) {
      await db.run(
        `INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity, subtotal)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [orderId, item.product_id, item.product_name, item.unit_price, item.quantity, item.subtotal]
      );

      // Decrement stock
      await db.run("UPDATE products SET stock_quantity = MAX(0, stock_quantity - ?) WHERE id = ?", [item.quantity, item.product_id]);
    }

    // Create Invoice
    const invoiceNumber = `INV-${new Date().getFullYear()}-${orderId.toString().padStart(4, '0')}`;
    await db.run(
      `INSERT INTO invoices (invoice_number, order_id, customer_name, total_amount, tax_amount, status)
       VALUES (?, ?, ?, ?, 0, 'Pending')`,
      [invoiceNumber, orderId, customer_name, totalAmount]
    );

    // Create in-app notification
    if (userId) {
      await db.run(
        `INSERT INTO notifications (title, message, type, target_url, user_id, is_broadcast, is_read)
         VALUES (?, ?, ?, ?, ?, 0, 0)`,
        [
          `🛍️ Order Placed (${orderNumber})`,
          `Your order for ₹${totalAmount} has been received and is currently Pending confirmation.`,
          'order',
          `/orders`,
          userId
        ]
      );
    }

    const order = await db.get("SELECT * FROM orders WHERE id = ?", [orderId]);
    const orderItems = await db.all("SELECT * FROM order_items WHERE order_id = ?", [orderId]);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      orderNumber,
      order: { ...order, items: orderItems }
    });
  } catch (err) {
    console.error('createOrder error:', err);
    res.status(500).json({ success: false, message: 'Failed to place order.' });
  }
};

// Customer Get Orders
exports.getCustomerOrders = async (req, res) => {
  try {
    const orders = await db.all("SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC", [req.user.id]);
    const enriched = [];
    for (const ord of orders) {
      const items = await db.all("SELECT * FROM order_items WHERE order_id = ?", [ord.id]);
      enriched.push({ ...ord, items });
    }
    res.json({ success: true, count: enriched.length, orders: enriched });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch orders.' });
  }
};

// Track Order by Number or Phone
exports.trackOrder = async (req, res) => {
  try {
    const { order_number, phone } = req.query;
    if (!order_number && !phone) {
      return res.status(400).json({ success: false, message: 'Please provide an order number or phone number.' });
    }

    let sql = "SELECT * FROM orders WHERE 1=1";
    const params = [];
    if (order_number) {
      sql += " AND (order_number = ? OR order_number LIKE ?)";
      params.push(order_number.trim(), `%${order_number.trim()}%`);
    }
    if (phone) {
      sql += " AND customer_phone = ?";
      params.push(phone.trim());
    }
    sql += " ORDER BY id DESC LIMIT 5";

    const orders = await db.all(sql, params);
    if (!orders.length) {
      return res.status(404).json({ success: false, message: 'No matching orders found.' });
    }

    const enriched = [];
    for (const ord of orders) {
      const items = await db.all("SELECT * FROM order_items WHERE order_id = ?", [ord.id]);
      enriched.push({ ...ord, items });
    }

    res.json({ success: true, orders: enriched });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error tracking order.' });
  }
};

// Admin Get All Orders
exports.adminGetOrders = async (req, res) => {
  try {
    const { status, search } = req.query;
    let sql = "SELECT * FROM orders WHERE 1=1";
    const params = [];

    if (status && status !== 'all') {
      sql += " AND order_status = ?";
      params.push(status);
    }

    if (search) {
      sql += " AND (order_number LIKE ? OR customer_name LIKE ? OR customer_phone LIKE ?)";
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    sql += " ORDER BY id DESC";

    const orders = await db.all(sql, params);
    const enriched = [];
    for (const ord of orders) {
      const items = await db.all("SELECT * FROM order_items WHERE order_id = ?", [ord.id]);
      const invoice = await db.get("SELECT * FROM invoices WHERE order_id = ?", [ord.id]);
      enriched.push({ ...ord, items, invoice });
    }

    res.json({ success: true, count: enriched.length, orders: enriched });
  } catch (err) {
    console.error('adminGetOrders error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch admin orders.' });
  }
};

// Admin Update Order Status
exports.adminUpdateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { order_status, payment_status, notes } = req.body;

    const validStatuses = ['Pending', 'Confirmed', 'Processing', 'Ready', 'Completed', 'Cancelled'];
    if (order_status && !validStatuses.includes(order_status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const order = await db.get("SELECT * FROM orders WHERE id = ?", [id]);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    let sql = "UPDATE orders SET updated_at = CURRENT_TIMESTAMP";
    const params = [];

    if (order_status) {
      sql += ", order_status = ?";
      params.push(order_status);
    }
    if (payment_status) {
      sql += ", payment_status = ?";
      params.push(payment_status);
    }
    if (notes !== undefined) {
      sql += ", notes = ?";
      params.push(notes);
    }

    sql += " WHERE id = ?";
    params.push(id);

    await db.run(sql, params);

    // If order status is Completed, mark invoice as Paid
    if (order_status === 'Completed') {
      await db.run("UPDATE invoices SET status = 'Paid' WHERE order_id = ?", [id]);
    } else if (order_status === 'Cancelled') {
      await db.run("UPDATE invoices SET status = 'Cancelled' WHERE order_id = ?", [id]);
    }

    // Send customer in-app notification about status update
    if (order.user_id && order_status && order_status !== order.order_status) {
      let icon = '📦';
      if (order_status === 'Confirmed') icon = '✅';
      if (order_status === 'Processing') icon = '⚙️';
      if (order_status === 'Ready') icon = '🚚';
      if (order_status === 'Completed') icon = '🎉';
      if (order_status === 'Cancelled') icon = '❌';

      await db.run(
        `INSERT INTO notifications (title, message, type, target_url, user_id, is_broadcast, is_read)
         VALUES (?, ?, ?, ?, ?, 0, 0)`,
        [
          `${icon} Order ${order.order_number} Updated`,
          `Your order status has been updated to: ${order_status}.`,
          'order',
          `/orders`,
          order.user_id
        ]
      );
    }

    const updated = await db.get("SELECT * FROM orders WHERE id = ?", [id]);
    const items = await db.all("SELECT * FROM order_items WHERE order_id = ?", [id]);

    res.json({
      success: true,
      message: `Order status updated to ${order_status || updated.order_status}`,
      order: { ...updated, items }
    });
  } catch (err) {
    console.error('adminUpdateOrderStatus error:', err);
    res.status(500).json({ success: false, message: 'Failed to update order status.' });
  }
};

// Get Invoice
exports.getOrderInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await db.get("SELECT * FROM orders WHERE id = ? OR order_number = ?", [id, id]);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    const items = await db.all("SELECT * FROM order_items WHERE order_id = ?", [order.id]);
    const invoice = await db.get("SELECT * FROM invoices WHERE order_id = ?", [order.id]);
    const settings = await db.all("SELECT key, value FROM settings");
    const config = {};
    settings.forEach(s => { config[s.key] = s.value; });

    res.json({
      success: true,
      invoice: {
        invoice_number: invoice ? invoice.invoice_number : `INV-${order.id}`,
        created_at: order.created_at,
        order_number: order.order_number,
        customer_name: order.customer_name,
        customer_email: order.customer_email,
        customer_phone: order.customer_phone,
        delivery_address: order.delivery_address,
        payment_method: order.payment_method,
        payment_status: order.payment_status,
        order_status: order.order_status,
        total_amount: order.total_amount,
        items,
        store: {
          name: config.store_name || 'RVK MOBILES',
          owner: config.owner_name || 'Krishna Moorthy',
          phones: [config.store_phone_1 || '8610903892', config.store_phone_2 || '8608103543'],
          address: config.store_address || 'Vanapatrai Kovil, Teppakulam Bazaar, Trichy',
          warranty: config.warranty_policy || 'Warranty details available at the time of service.'
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch invoice.' });
  }
};