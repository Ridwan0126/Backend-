const YukAngkut = require('../../models/yukangkut/YukAngkut');
const db = require('../../config/db'); ;

// Fungsi untuk mengambil semua pesan untuk pengguna
exports.getMessages = (req, res) => {
  const { userId } = req.params;

  db.query(
    'SELECT messages.*, sender.first_name AS sender_first_name, sender.last_name AS sender_last_name, recipient.first_name AS recipient_first_name, recipient.last_name AS recipient_last_name FROM messages INNER JOIN users AS sender ON sender.id = messages.sender_id INNER JOIN users AS recipient ON recipient.id = messages.recipient_id WHERE messages.sender_id = ? OR messages.recipient_id = ? ORDER BY messages.created_at DESC',
    [userId, userId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    }
  );
};

// Fungsi untuk mengirimkan pesan baru
exports.sendMessage = async (req, res) => {
  const { senderId, recipientId, pickupId } = req.body;

  try {
    // Ambil data permintaan penjemputan berdasarkan pickup_id
    const pickupRequest = await YukAngkut.findByPickupId(pickupId);

    if (!pickupRequest) {
      return res.status(404).json({ message: "Pickup request not found." });
    }

    // Buat pesan berdasarkan permintaan penjemputan
    const message = `Permintaan baru! Pengguna ${pickupRequest.name} telah meminta penjemputan sampah pada ${pickupRequest.date}, lokasi: ${pickupRequest.location}`;

    // Simpan pesan ke database
    db.query(
      'INSERT INTO messages (sender_id, recipient_id, message) VALUES (?, ?, ?)',
      [senderId, recipientId, message],
      (err, results) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: results.insertId, message });
      }
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Fungsi untuk menangani pembaruan status dan mengirim pesan
exports.updatePickupStatusAndNotify = async (req, res) => {
    const { pickupId, newStatus, senderId, recipientId } = req.body;
  
    try {
      // Update status permintaan
      const result = await YukAngkut.updateByPickupId(pickupId, { status: newStatus });
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Pickup request not found." });
      }
  
      // Ambil data permintaan penjemputan
      const pickupRequest = await YukAngkut.findByPickupId(pickupId);
  
      if (!pickupRequest) {
        return res.status(404).json({ message: "Pickup request not found." });
      }
  
      // Buat pesan pembaruan
      const message = `Status permintaan penjemputan sampah untuk ${pickupRequest.name} telah berubah menjadi ${newStatus}. Lokasi: ${pickupRequest.location}`;
  
      // Simpan pesan ke database
      db.query(
        'INSERT INTO messages (sender_id, recipient_id, message) VALUES (?, ?, ?)',
        [senderId, recipientId, message],
        (err, results) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.status(200).json({ message: 'Pickup status updated and notification sent.' });
        }
      );
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };