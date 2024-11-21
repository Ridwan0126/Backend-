const db = require('../../config/db');

const YukBuang = {
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM yuk_buang');
        return rows;
    },

    create: async (data) => {
        const { delivery_id, name, location, date, time, type, amount, photo, status } = data;
        const [result] = await db.query(
            'INSERT INTO yuk_buang (delivery_id, name, location, date, time, type, amount, photo, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [delivery_id, name, location, date, time, type, amount, photo, status]
        );
        return result;
    },

    deleteByDeliveryId: async (delivery_id) => {
        const [result] = await db.query('DELETE FROM yuk_buang WHERE delivery_id = ?', [delivery_id]);
        return result;
    },
    updateByDeliveryId: async (delivery_id, data) => {
        const { name, location, date, time, type, amount, photo, status } = data;
        const [result] = await db.query(
            'UPDATE yuk_buang SET name = ?, location = ?, date = ?, time = ?, type = ?, amount = ?, photo = ?, status = ? WHERE delivery_id = ?',
            [name, location, date, time, type, amount, photo, status, delivery_id]
        );
        return result;
    },

    findByDeliveryId: async (delivery_id) => {
        const [rows] = await db.query('SELECT * FROM yuk_buang WHERE delivery_id = ?', [delivery_id]);
        return rows[0]; // Mengembalikan satu baris data
    }
};

module.exports = YukBuang;