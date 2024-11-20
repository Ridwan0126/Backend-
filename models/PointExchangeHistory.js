const db = require('../config/db');

const PointExchangeHistory = {
    getAll: async () => {
        try {
            const [results] = await db.query('SELECT * FROM penukaran_poin');
            return results;
        } catch (error) {
            throw error;
        }
    },

    create: async (data) => {
        const { id, name, wallet, number, point, give, status } = data;
        try {
            const [results] = await db.query(
                'INSERT INTO penukaran_poin SET ?',
                { id, name, wallet, number, point, give, status }
            );
            return results;
        } catch (error) {
            throw error;
        }
    },

    updateById: async (id, data) => {
        try {
            const [results] = await db.query('UPDATE penukaran_poin SET ? WHERE id = ?', [data, id]);
            return results;
        } catch (error) {
            throw error;
        }
    },

    deleteById: async (id) => {
        try {
            const [results] = await db.query('DELETE FROM penukaran_poin WHERE id = ?', [id]);
            return results;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = PointExchangeHistory;