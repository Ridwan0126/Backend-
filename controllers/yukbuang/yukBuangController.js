const YukBuang = require('../../models/yukbuang/YukBuang');
const generateDeliveryId = require('../../helpers/generateDeliveryID');
const db = require('../../config/db');
const jwt = require('jsonwebtoken'); 
require('dotenv').config();

exports.getAllYukBuang = async (req, res) => {
    try {
        const data = await YukBuang.getAll();
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: 'Error fetching data', error: error.message });
    }
};

exports.createYukBuang = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token not provided' });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY); // Verifikasi token
        } catch (err) {
            return res.status(401).json({ message: 'Invalid or expired token', error: err.message });
        }

        const email = decoded.email; // Ambil email dari token

        const photoPaths = req.files ? req.files.map(file => 'uploads/yukbuang/' + file.filename) : [];

        if (photoPaths.length === 0) {
            return res.status(400).json({ message: 'At least one photo must be uploaded' });
        }

        if (photoPaths.length > 2) {
            return res.status(400).json({ message: 'You can only upload up to 2 photos' });
        }

        const { name, location, date, time, type, amount, status, transaction_type, price_per_kg } = req.body;

        const transactionType = transaction_type || 'Pengantaran';
        const delivery_id = await generateDeliveryId();
        const pricePerKg = (price_per_kg === undefined || price_per_kg === '' || price_per_kg === 'null') ? null : parseFloat(price_per_kg);

        // Masukkan data ke database, termasuk email
        const result = await YukBuang.create({
            delivery_id,
            name,
            location,
            date,
            time,
            type,
            amount,
            photo: photoPaths,
            status,
            transaction_type: transactionType,
            price_per_kg: pricePerKg,
            email, // Sertakan email
        });

        if (result.affectedRows > 0) {
            res.status(201).json({
                message: 'Yuk Buang created successfully',
                id: result.insertId,
                delivery_id,
            });
        } else {
            res.status(400).json({ message: 'Failed to create Yuk Buang' });
        }
    } catch (error) {
        console.error('Error creating data:', error);
        res.status(500).json({ message: 'Error creating data', error: error.message });
    }
};


exports.deleteYukBuang = async (req, res) => {
    try {
        const { delivery_id } = req.params;

        const result = await YukBuang.deleteByDeliveryId(delivery_id);

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


exports.updateYukBuang = async (req, res) => {
    const { delivery_id } = req.params;
    const { date, ...updatedData } = req.body;

    try {
        const [existingData] = await db.query('SELECT * FROM yuk_buang WHERE delivery_id = ?', [delivery_id]);
        if (existingData.length === 0) {
            return res.status(404).json({ message: 'Data not found' });
        }
        const formattedDate = date ? new Date(date).toISOString().split('T')[0] : null; 

        const result = await YukBuang.updateByDeliveryId(delivery_id, {
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