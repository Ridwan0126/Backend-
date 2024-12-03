const db = require('../../config/db');

const YukAngkut = {
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM yuk_angkut');
        return rows;
    },

    create: async (data) => {
        const { pickup_id, name, location, date, time, type, amount, photo, status, driver, transaction_type, price_per_kg } = data;
        const [result] = await db.query(
            'INSERT INTO yuk_angkut (pickup_id, name, location, date, time, type, amount, photo, status, driver, transaction_type, price_per_kg) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [pickup_id, name, location, date, time, type, amount, photo, status, driver, transaction_type, price_per_kg]
        );
        return result;
    },

    deleteByPickupId: async (pickup_id) => {
        const [result] = await db.query('DELETE FROM yuk_angkut WHERE pickup_id = ?', [pickup_id]);
        return result;
    },

    updateByPickupId: async (pickup_id, data) => {
        const { name, location, date, time, type, amount, photo, status, driver } = data;
        const [result] = await db.query(
            'UPDATE yuk_angkut SET name = ?, location = ?, date = ?, time = ?, type = ?, amount = ?, photo = ?, status = ?, driver = ? WHERE pickup_id = ?',
            [name, location, date, time, type, amount, photo, status, driver, pickup_id]
        );
        return result;
    },

    findByPickupId: async (pickup_id) => {
        const [rows] = await db.query('SELECT * FROM yuk_angkut WHERE pickup_id = ?', [pickup_id]);
        return rows[0]; 
    }
};

module.exports = YukAngkut;