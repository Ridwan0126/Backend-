const db = require('../../config/db');  
const YukAngkut = require('../../models/yukangkut/YukAngkut');

exports.getMessagesForAdmin = async (req, res) => {
  try {
    const [results] = await db.query(
      `SELECT messages.*, users.name AS sender_name 
       FROM messages
       LEFT JOIN users ON users.id = messages.sender_id
       WHERE messages.recipient_id IS NULL
       ORDER BY messages.created_at DESC`
    );
    res.json(results);
  } catch (err) {
    console.error('Error fetching messages:', err);
    return res.status(500).json({ error: err.message });
  }
};

exports.sendMessage = async (req, res) => {
  const { senderId, recipientId, pickupId, message } = req.body;

  if (!senderId || !recipientId || !pickupId || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const [results] = await db.query(
      'INSERT INTO messages (sender_id, recipient_id, message, pickup_id) VALUES (?, ?, ?, ?)',
      [senderId, recipientId, message, pickupId]
    );
    return res.status(201).json({ message: 'Message sent successfully.' });
  } catch (err) {
    console.error('Error inserting message:', err);
    return res.status(500).json({ error: err.message });
  }
};

exports.updatePickupStatusAndNotify = async (req, res) => {
  const { pickupId, newStatus, senderId, recipientId } = req.body;

  if (!pickupId || !newStatus || !senderId || !recipientId) {
    return res.status(400).json({ error: 'PickupId, newStatus, senderId, and recipientId are required' });
  }

  try {
    const [result] = await db.query(
      'UPDATE pickUpRequests SET status = ? WHERE pickup_id = ?',
      [newStatus, pickupId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Pickup request not found." });
    }

    const [pickupRequest] = await db.query('SELECT * FROM pickUpRequests WHERE pickup_id = ?', [pickupId]);

    if (!pickupRequest || pickupRequest.length === 0) {
      return res.status(404).json({ message: "Pickup request not found." });
    }

    const message = `Status permintaan penjemputan sampah untuk ${pickupRequest[0].name} telah berubah menjadi ${newStatus}. Lokasi: ${pickupRequest[0].location}`;

    await db.query(
      'INSERT INTO messages (sender_id, recipient_id, message, pickup_id) VALUES (?, ?, ?, ?)',
      [senderId, recipientId, message, pickupId]
    );
    
    return res.status(200).json({ message: 'Pickup status updated and notification sent.' });
  } catch (err) {
    console.error('Error updating pickup status and sending notification:', err);
    return res.status(500).json({ error: err.message });
  }
};