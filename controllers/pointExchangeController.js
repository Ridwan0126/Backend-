const path = require('path');
const PointExchangeHistory = require('../models/PointExchangeHistory');


const pointExchangeController = {
    getAll: async (req, res) => {
        try {
            console.log("Fetching data from PointExchangeHistory...");
            const data = await PointExchangeHistory.getAll();
            console.log("Data fetched successfully:", data);
            res.json(data);
        } catch (error) {
            console.error('Error fetching data:', error);
            res.status(500).json({ message: 'Error fetching data', error: error.message });
        }
    },
    

    create: async (req, res) => {
        try {
            const newData = req.body;

            const newID = await generateAutoID();
            const dataToInsert = {
                id: newID,
                ...newData
            };

            const result = await PointExchangeHistory.create(dataToInsert);
            res.status(201).json({ message: 'Data created successfully', result });
        } catch (error) {
            console.error('Error creating data:', error);
            res.status(500).json({ message: 'Error creating data', error });
        }
    },

    update: async (req, res) => {
        try {
            const { id } = req.params;
            const updatedData = req.body;
            const result = await PointExchangeHistory.updateById(id, updatedData);

            if (result.affectedRows > 0) {
                res.json({ message: 'Data updated successfully' });
            } else {
                res.status(404).json({ message: 'Data not found' });
            }
        } catch (error) {
            console.error('Error updating data:', error);
            res.status(500).json({ message: 'Error updating data', error });
        }
    },

    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await PointExchangeHistory.deleteById(id);

            if (result.affectedRows > 0) {
                res.json({ message: 'Data deleted successfully' });
            } else {
                res.status(404).json({ message: 'Data not found' });
            }
        } catch (error) {
            console.error('Error deleting data:', error);
            res.status(500).json({ message: 'Error deleting data', error });
        }
    },

    uploadReceipt: async (req, res) => {
        const { id } = req.params;

        // Jika tidak ada file yang diunggah
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const fileUrl = `/uploads/receipts/${req.file.filename}`;

        try {
            const result = await PointExchangeHistory.updateById(id, { receipt: fileUrl });

            if (result.affectedRows > 0) {
                res.json({ message: 'Receipt uploaded successfully', receipt: fileUrl });
            } else {
                res.status(404).json({ message: 'Data not found' });
            }
        } catch (error) {
            console.error('Error uploading receipt:', error);
            res.status(500).json({ message: 'Error uploading receipt', error });
        }
    }
};

module.exports = pointExchangeController;