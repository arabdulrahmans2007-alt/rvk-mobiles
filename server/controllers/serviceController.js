const { db } = require('../config/db');

// Display Pricing Info
exports.getDisplayPricingInfo = async (req, res) => {
  try {
    const brands = [
      { name: 'Redmi / Xiaomi', popularModels: ['Note 11 Pro', 'Note 12 Pro', 'Note 10', '10 Prime', 'Note 9 Pro', '9A / 9C'] },
      { name: 'Realme', popularModels: ['Realme 9 Pro+', 'Realme 8 5G', 'Realme 7', 'C35', 'Narzo 50', 'Narzo 30'] },
      { name: 'Samsung', popularModels: ['Galaxy M33', 'Galaxy A53', 'Galaxy F23', 'Galaxy A13', 'Galaxy M12', 'Galaxy S21 FE'] },
      { name: 'Vivo', popularModels: ['Vivo T1 5G', 'Vivo V23', 'Vivo Y21', 'Vivo Y20', 'Vivo V20', 'Vivo Y75'] },
      { name: 'Oppo', popularModels: ['Oppo Reno 8', 'Oppo F21 Pro', 'Oppo A78', 'Oppo A57', 'Oppo A16', 'Oppo F19'] },
      { name: 'OnePlus', popularModels: ['Nord CE 2', 'Nord 2T', 'Nord CE 3 Lite', 'OnePlus 9R', 'OnePlus 8T', 'OnePlus 10R'] },
      { name: 'Poco', popularModels: ['Poco X4 Pro 5G', 'Poco M4 Pro', 'Poco X3 Pro', 'Poco M3', 'Poco F3 GT'] },
      { name: 'iPhone / Apple', popularModels: ['iPhone 11', 'iPhone 12', 'iPhone 13', 'iPhone XR', 'iPhone 8 Plus'] },
      { name: 'Motorola', popularModels: ['Moto G52', 'Moto G71 5G', 'Moto G60', 'Moto Edge 20 Fusion'] }
    ];

    const displayTypes = [
      {
        id: 'lcd',
        name: 'LCD Display Replacement',
        priceRange: '₹999 – ₹1,399',
        minPrice: 999,
        maxPrice: 1399,
        badge: 'BUDGET FRIENDLY',
        description: 'Standard crystal LCD replacement module with responsive touch response and clean color balance.'
      },
      {
        id: 'led',
        name: 'LED / OLED Display Replacement',
        priceRange: '₹2,500 – ₹3,999',
        minPrice: 2500,
        maxPrice: 3999,
        badge: 'PREMIUM QUALITY',
        description: 'Vibrant color reproduction, rich contrast, deep blacks, and swift touch sensitivity.'
      },
      {
        id: 'curve',
        name: 'Curved Edge Display',
        priceRange: 'Secret Offers',
        minPrice: null,
        maxPrice: null,
        badge: 'EXCLUSIVE VIP QUOTE',
        description: 'Curved display replacement with custom edge fitment. Contact RVK Mobiles directly for secret customized pricing.'
      }
    ];

    res.json({
      success: true,
      displayTypes,
      brands,
      warrantyPolicy: 'Warranty details available at the time of service.'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch display pricing.' });
  }
};

// Book Display Service
exports.bookDisplayService = async (req, res) => {
  try {
    const { customer_name, customer_phone, device_brand, device_model, display_type, service_type, address, notes } = req.body;

    if (!customer_name || !customer_phone || !device_brand || !device_model || !display_type) {
      return res.status(400).json({ success: false, message: 'Please fill in all required booking fields.' });
    }

    let estimatedPrice = '₹999 – ₹1,399';
    if (display_type.toLowerCase().includes('led')) {
      estimatedPrice = '₹2,500 – ₹3,999';
    } else if (display_type.toLowerCase().includes('curve')) {
      estimatedPrice = 'Secret Offers (Call for quote)';
    }

    const bookingCode = `RVK-DSP-${Date.now().toString().slice(-5)}`;
    const userId = req.user ? req.user.id : null;

    const result = await db.run(
      `INSERT INTO display_services (booking_code, user_id, customer_name, customer_phone, device_brand, device_model, display_type, estimated_price, service_type, address, status, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', ?)`,
      [
        bookingCode,
        userId,
        customer_name.trim(),
        customer_phone.trim(),
        device_brand.trim(),
        device_model.trim(),
        display_type,
        estimatedPrice,
        service_type || 'In-Store',
        address ? address.trim() : 'In-Store Drop-off',
        notes || ''
      ]
    );

    // In-app notification
    if (userId) {
      await db.run(
        `INSERT INTO notifications (title, message, type, target_url, user_id, is_broadcast, is_read)
         VALUES (?, ?, ?, ?, ?, 0, 0)`,
        [
          `📱 Display Booking Confirmed (${bookingCode})`,
          `Your display replacement request for ${device_brand} ${device_model} has been received.`,
          'booking',
          `/booking-tracking?code=${bookingCode}`,
          userId
        ]
      );
    }

    const booking = await db.get("SELECT * FROM display_services WHERE id = ?", [result.lastInsertRowid]);

    res.status(201).json({
      success: true,
      message: 'Display service booking registered successfully!',
      bookingCode,
      booking
    });
  } catch (err) {
    console.error('bookDisplayService error:', err);
    res.status(500).json({ success: false, message: 'Failed to register display service booking.' });
  }
};

// Book Doorstep Service
exports.bookDoorstepService = async (req, res) => {
  try {
    const { customer_name, customer_phone, address, distance_km, is_rvk_member, preferred_date, preferred_time, problem_description } = req.body;

    if (!customer_name || !customer_phone || !address) {
      return res.status(400).json({ success: false, message: 'Please provide customer name, phone and complete address.' });
    }

    const dist = parseFloat(distance_km) || 5;
    const isMember = is_rvk_member === true || is_rvk_member === 1 || (req.user && req.user.is_member === 1);

    // Travel charge computation:
    // RVK Member: ₹0 for ANY distance
    // Regular Customer: <= 20KM => ₹0, >20KM => (dist - 20) * rate
    let travelCharge = 0;
    if (!isMember && dist > 20) {
      const extraKmSetting = await db.get("SELECT value FROM settings WHERE key = 'doorstep_extra_km_rate'");
      const ratePerKm = extraKmSetting ? parseFloat(extraKmSetting.value) : 10;
      travelCharge = Math.round((dist - 20) * ratePerKm);
    }

    const bookingCode = `RVK-DST-${Date.now().toString().slice(-5)}`;
    const userId = req.user ? req.user.id : null;

    const result = await db.run(
      `INSERT INTO doorstep_bookings (booking_code, user_id, customer_name, customer_phone, address, distance_km, is_rvk_member, preferred_date, preferred_time, problem_description, status, travel_charge)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', ?)`,
      [
        bookingCode,
        userId,
        customer_name.trim(),
        customer_phone.trim(),
        address.trim(),
        dist,
        isMember ? 1 : 0,
        preferred_date || new Date().toISOString().split('T')[0],
        preferred_time || '11:00 AM',
        problem_description || 'General Mobile Service / Repair',
        travelCharge
      ]
    );

    if (userId) {
      await db.run(
        `INSERT INTO notifications (title, message, type, target_url, user_id, is_broadcast, is_read)
         VALUES (?, ?, ?, ?, ?, 0, 0)`,
        [
          `🚗 Doorstep Booking (${bookingCode})`,
          `Doorstep technician request confirmed for ${preferred_date || 'today'}. Travel fee: ₹${travelCharge}.`,
          'booking',
          `/booking-tracking?code=${bookingCode}`,
          userId
        ]
      );
    }

    const booking = await db.get("SELECT * FROM doorstep_bookings WHERE id = ?", [result.lastInsertRowid]);

    res.status(201).json({
      success: true,
      message: 'Doorstep service booked successfully!',
      bookingCode,
      booking,
      travelCharge,
      isMember
    });
  } catch (err) {
    console.error('bookDoorstepService error:', err);
    res.status(500).json({ success: false, message: 'Failed to book doorstep service.' });
  }
};

// Track Service Booking (Display or Doorstep)
exports.trackServiceBooking = async (req, res) => {
  try {
    const { code, phone } = req.query;

    if (!code && !phone) {
      return res.status(400).json({ success: false, message: 'Please provide booking code or phone number.' });
    }

    let displayBookings = [];
    let doorstepBookings = [];

    if (code) {
      displayBookings = await db.all("SELECT *, 'Display Replacement' as service_category FROM display_services WHERE booking_code = ? OR booking_code LIKE ?", [code.trim(), `%${code.trim()}%`]);
      doorstepBookings = await db.all("SELECT *, 'Doorstep Service' as service_category FROM doorstep_bookings WHERE booking_code = ? OR booking_code LIKE ?", [code.trim(), `%${code.trim()}%`]);
    } else if (phone) {
      displayBookings = await db.all("SELECT *, 'Display Replacement' as service_category FROM display_services WHERE customer_phone = ? ORDER BY id DESC LIMIT 5", [phone.trim()]);
      doorstepBookings = await db.all("SELECT *, 'Doorstep Service' as service_category FROM doorstep_bookings WHERE customer_phone = ? ORDER BY id DESC LIMIT 5", [phone.trim()]);
    }

    const allBookings = [...displayBookings, ...doorstepBookings];

    if (!allBookings.length) {
      return res.status(404).json({ success: false, message: 'No matching bookings found for the provided details.' });
    }

    res.json({ success: true, count: allBookings.length, bookings: allBookings });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error tracking service booking.' });
  }
};

// Admin Get Display Services
exports.adminGetDisplayServices = async (req, res) => {
  try {
    const { status, search } = req.query;
    let sql = "SELECT * FROM display_services WHERE 1=1";
    const params = [];

    if (status && status !== 'all') {
      sql += " AND status = ?";
      params.push(status);
    }
    if (search) {
      sql += " AND (booking_code LIKE ? OR customer_name LIKE ? OR customer_phone LIKE ? OR device_model LIKE ?)";
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }
    sql += " ORDER BY id DESC";

    const bookings = await db.all(sql, params);
    res.json({ success: true, count: bookings.length, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch display services.' });
  }
};

// Admin Update Display Service Status
exports.adminUpdateDisplayService = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, estimated_price, notes } = req.body;

    const booking = await db.get("SELECT * FROM display_services WHERE id = ?", [id]);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });

    let sql = "UPDATE display_services SET updated_at = CURRENT_TIMESTAMP";
    const params = [];

    if (status) {
      sql += ", status = ?";
      params.push(status);
    }
    if (estimated_price) {
      sql += ", estimated_price = ?";
      params.push(estimated_price);
    }
    if (notes !== undefined) {
      sql += ", notes = ?";
      params.push(notes);
    }

    sql += " WHERE id = ?";
    params.push(id);

    await db.run(sql, params);

    // Notify customer
    if (booking.user_id && status && status !== booking.status) {
      await db.run(
        `INSERT INTO notifications (title, message, type, target_url, user_id, is_broadcast, is_read)
         VALUES (?, ?, ?, ?, ?, 0, 0)`,
        [
          `📱 Display Repair Status: ${status}`,
          `Your display repair request for ${booking.device_brand} ${booking.device_model} is now: ${status}.`,
          'booking',
          `/booking-tracking?code=${booking.booking_code}`,
          booking.user_id
        ]
      );
    }

    const updated = await db.get("SELECT * FROM display_services WHERE id = ?", [id]);
    res.json({ success: true, message: 'Display service updated successfully.', booking: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update display service.' });
  }
};

// Admin Get Doorstep Bookings
exports.adminGetDoorstepBookings = async (req, res) => {
  try {
    const { status, search } = req.query;
    let sql = "SELECT * FROM doorstep_bookings WHERE 1=1";
    const params = [];

    if (status && status !== 'all') {
      sql += " AND status = ?";
      params.push(status);
    }
    if (search) {
      sql += " AND (booking_code LIKE ? OR customer_name LIKE ? OR customer_phone LIKE ? OR address LIKE ?)";
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }
    sql += " ORDER BY id DESC";

    const bookings = await db.all(sql, params);
    res.json({ success: true, count: bookings.length, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch doorstep bookings.' });
  }
};

// Admin Update Doorstep Booking Status
exports.adminUpdateDoorstepBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, travel_charge, problem_description } = req.body;

    const booking = await db.get("SELECT * FROM doorstep_bookings WHERE id = ?", [id]);
    if (!booking) return res.status(404).json({ success: false, message: 'Doorstep booking not found.' });

    let sql = "UPDATE doorstep_bookings SET updated_at = CURRENT_TIMESTAMP";
    const params = [];

    if (status) {
      sql += ", status = ?";
      params.push(status);
    }
    if (travel_charge !== undefined) {
      sql += ", travel_charge = ?";
      params.push(parseFloat(travel_charge));
    }
    if (problem_description !== undefined) {
      sql += ", problem_description = ?";
      params.push(problem_description);
    }

    sql += " WHERE id = ?";
    params.push(id);

    await db.run(sql, params);

    // Notify customer
    if (booking.user_id && status && status !== booking.status) {
      await db.run(
        `INSERT INTO notifications (title, message, type, target_url, user_id, is_broadcast, is_read)
         VALUES (?, ?, ?, ?, ?, 0, 0)`,
        [
          `🚗 Doorstep Technician Status: ${status}`,
          `Your doorstep service booking (${booking.booking_code}) is now: ${status}.`,
          'booking',
          `/booking-tracking?code=${booking.booking_code}`,
          booking.user_id
        ]
      );
    }

    const updated = await db.get("SELECT * FROM doorstep_bookings WHERE id = ?", [id]);
    res.json({ success: true, message: 'Doorstep booking updated successfully.', booking: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update doorstep booking.' });
  }
};