const { db } = require('../config/db');

// Get active offers
exports.getOffers = async (req, res) => {
  try {
    const offers = await db.all("SELECT * FROM offers WHERE is_active = 1 ORDER BY is_todays_offer DESC, id DESC");
    res.json({ success: true, count: offers.length, offers });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch offers' });
  }
};

// Get today's dynamic offer
exports.getTodaysOffer = async (req, res) => {
  try {
    let offer = await db.get("SELECT * FROM offers WHERE is_todays_offer = 1 AND is_active = 1 ORDER BY id DESC LIMIT 1");
    if (!offer) {
      // Fallback to latest active offer if none explicitly marked
      offer = await db.get("SELECT * FROM offers WHERE is_active = 1 ORDER BY id DESC LIMIT 1");
    }

    // Dynamic current date formatting
    const today = new Date();
    const formattedToday = today.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    res.json({
      success: true,
      offer,
      currentDate: formattedToday,
      isoDate: today.toISOString().split('T')[0]
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch today offer' });
  }
};

// Admin Get All Offers
exports.adminGetAllOffers = async (req, res) => {
  try {
    const offers = await db.all("SELECT * FROM offers ORDER BY is_todays_offer DESC, id DESC");
    res.json({ success: true, count: offers.length, offers });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch admin offers' });
  }
};

// Admin Create Offer (Triggers Customer In-App Notification)
exports.createOffer = async (req, res) => {
  try {
    const { title, description, badge, original_price, offer_price, discount_text, target_service, start_date, end_date, is_active, is_todays_offer } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required.' });
    }

    const isToday = is_todays_offer === 1 || is_todays_offer === true ? 1 : 0;

    // If marked as Today's Offer, unmark other offers
    if (isToday) {
      await db.run("UPDATE offers SET is_todays_offer = 0");
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const result = await db.run(
      `INSERT INTO offers (title, description, badge, original_price, offer_price, discount_text, target_service, start_date, end_date, is_active, is_todays_offer)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title.trim(),
        description.trim(),
        badge || "TODAY'S SPECIAL",
        original_price ? parseFloat(original_price) : null,
        offer_price ? parseFloat(offer_price) : null,
        discount_text || (original_price && offer_price ? `Save ₹${original_price - offer_price}` : 'Special Price'),
        target_service || 'Storewide',
        start_date || todayStr,
        end_date || nextMonth,
        is_active !== undefined ? (is_active ? 1 : 0) : 1,
        isToday
      ]
    );

    const offerId = result.lastInsertRowid;

    // AUTO-CREATE IN-APP NOTIFICATION TO ALL CUSTOMERS
    const notifTitle = isToday ? "🎁 Today's Special Offer Published!" : "🔥 New Offer Available!";
    const notifMsg = `RVK Mobiles: ${title}. ${offer_price ? `Available now at ₹${offer_price}` : 'Check it out now!'}`;

    await db.run(
      `INSERT INTO notifications (title, message, type, target_url, offer_id, is_broadcast, is_read)
       VALUES (?, ?, 'offer', '/offers', ?, 1, 0)`,
      [notifTitle, notifMsg, offerId]
    );

    const offer = await db.get("SELECT * FROM offers WHERE id = ?", [offerId]);

    res.status(201).json({
      success: true,
      message: 'Offer created and customer notifications published successfully!',
      offer
    });
  } catch (err) {
    console.error('createOffer error:', err);
    res.status(500).json({ success: false, message: 'Failed to create offer.' });
  }
};

// Admin Update Offer
exports.updateOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, badge, original_price, offer_price, discount_text, target_service, start_date, end_date, is_active, is_todays_offer } = req.body;

    const isToday = is_todays_offer === 1 || is_todays_offer === true ? 1 : 0;

    if (isToday) {
      await db.run("UPDATE offers SET is_todays_offer = 0 WHERE id != ?", [id]);
    }

    await db.run(
      `UPDATE offers
       SET title = ?, description = ?, badge = ?, original_price = ?, offer_price = ?, discount_text = ?, target_service = ?, start_date = ?, end_date = ?, is_active = ?, is_todays_offer = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        title,
        description,
        badge,
        original_price ? parseFloat(original_price) : null,
        offer_price ? parseFloat(offer_price) : null,
        discount_text,
        target_service,
        start_date,
        end_date,
        is_active ? 1 : 0,
        isToday,
        id
      ]
    );

    const offer = await db.get("SELECT * FROM offers WHERE id = ?", [id]);
    res.json({ success: true, message: 'Offer updated successfully', offer });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update offer' });
  }
};

// Admin Delete Offer
exports.deleteOffer = async (req, res) => {
  try {
    const { id } = req.params;
    await db.run("DELETE FROM offers WHERE id = ?", [id]);
    res.json({ success: true, message: 'Offer deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete offer' });
  }
};