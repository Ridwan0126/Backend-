const YukAngkut = require('../../models/yukangkut/YukAngkut');
const generatePickupId = require('../../helpers/generatePickupID');
const db = require('../../config/db'); // Import koneksi database

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
        const { name, location, date, time, type, amount, photo, status, driver } = req.body;
        const pickup_id = await generatePickupId(); // Generate pickup_id otomatis

        const result = await YukAngkut.create({
            pickup_id,
            name,
            location,
            date,
            time,
            type,
            amount,
            photo,
            status,
            driver,
        });

        if (result.affectedRows > 0) {
            res.status(201).json({
                message: 'Yuk Angkut created successfully',
                pickup_id,
            });
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
        // Validasi jika data tidak ditemukan
        const [existingData] = await db.query('SELECT * FROM yuk_angkut WHERE pickup_id = ?', [pickup_id]);
        if (existingData.length === 0) {
            return res.status(404).json({ message: 'Data not found' });
        }

        // Konversi format tanggal ke 'YYYY-MM-DD'
        const formattedDate = date ? new Date(date).toISOString().split('T')[0] : null; // Null jika tidak ada tanggal

        const result = await YukAngkut.updateByPickupId(pickup_id, {
            ...updatedData,
            date: formattedDate // Gunakan tanggal yang sudah diformat
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