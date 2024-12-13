const YukAngkut = require('../../models/yukangkut/YukAngkut');
const messageController = require('../../controllers/message/messageController');
const generatePickupId = require('../../helpers/generatePickupID');
const jwt = require('jsonwebtoken');
const db = require('../../config/db'); 
require('dotenv').config();

exports.getAllYukAngkut = async (req, res) => {
    try {
        const data = await YukAngkut.getAll();
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: 'Error fetching data', error: error.message });
    }
}; 

exports.createYukAngkut = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Token not provided' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired token', error: err.message });
    }
    
    const senderId = decoded.id; 
    const email = decoded.email; 

    const photoPaths = req.files?.map(file => 'uploads/yukangkut/' + file.filename) || [];

    if (photoPaths.length === 0) {
      return res.status(400).json({ message: 'At least one photo must be uploaded' });
    }
    
    if (photoPaths.length > 2) {
      return res.status(400).json({ message: 'You can only upload up to 2 photos' });
    }

    const { name, location, date, time, type, amount, status, driver, transaction_type, price_per_kg} = req.body;
    const transactionType = transaction_type || 'Penjemputan'; 
    const statusValue = status || 'Proses';
    
    if (!name || !location || !date || !time || !type || !amount || price_per_kg === undefined || !email) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const pickup_id = await generatePickupId();
     const pricePerKg = (price_per_kg === undefined || price_per_kg === '' || price_per_kg === 'null') ? null : parseFloat(price_per_kg);
    

    const result = await YukAngkut.create({
      pickup_id,
      name,
      location,
      date,
      time,
      type,
      amount,
      photo: photoPaths.join(','), 
      status: statusValue,
      driver,
      transaction_type: transactionType, 
      price_per_kg: pricePerKg,
      email,
    });

    if (result.affectedRows > 0) {
      const message = `Permintaan baru! Pengguna ${name} telah meminta penjemputan sampah pada ${formatDate(date)}.`;

      function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long' });
      }

      try {
        await db.query(
          'INSERT INTO messages (sender_id, recipient_id, message, pickup_id) VALUES (?, ?, ?, ?)',
          [senderId, null, message, pickup_id]
        );

        res.status(201).json({
          message: 'Yuk Angkut created successfully and message sent.',
          pickup_id,
        });

      } catch (err) {
        console.error('Error inserting messages:', err);
        res.status(500).json({ message: 'Error inserting messages', error: err.message });
      }
    } else {
      res.status(400).json({ message: 'Failed to create Yuk Angkut' });
    }
  } catch (error) {
    console.error('Error creating data:', error);
    res.status(500).json({ message: 'Error creating data', error: error.message });
  }
};

exports.deleteYukAngkut = async (req, res) => {
    try {
        const { pickup_id } = req.params;

        const result = await YukAngkut.deleteByPickupId(pickup_id);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Data deleted successfully' });
        } else {
            res.status(404).json({ message: 'Data not found' });
        }
    } catch (error) {
        console.error('Error deleting data:', error);
        res.status(500).json({ message: 'Error deleting data', error: error.message });
    }
};

exports.updateYukAngkut = async (req, res) => {
    const { pickup_id } = req.params;
    const { date, ...updatedData } = req.body;

    try {
        const [existingData] = await db.query('SELECT * FROM yuk_angkut WHERE pickup_id = ?', [pickup_id]);
        if (existingData.length === 0) {
            return res.status(404).json({ message: 'Data not found' });
        }

        const formattedDate = date ? new Date(date).toISOString().split('T')[0] : null; 
        const result = await YukAngkut.updateByPickupId(pickup_id, {
            ...updatedData,
            date: formattedDate 
        });

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Data updated successfully' });
        } else {
            res.status(404).json({ message: 'Data not found' });
        }
    } catch (error) {
        console.error('Error updating data:', error);
        res.status(500).json({ message: 'Error updating data', error: error.message });
    }
};