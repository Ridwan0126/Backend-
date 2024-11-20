// helpers/generateAutoID.js
const pool = require('../config/db');

async function generateAutoID() {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0].replace(/-/g, ''); // Format YYYYMMDD

    const [rows] = await pool.query(
        `SELECT id FROM penukaran_poin WHERE id LIKE ? ORDER BY id DESC LIMIT 1`,
        [`KP-${formattedDate}%`]
    );

    if (rows.length > 0) {
        const lastID = rows[0].id;
        const lastIncrement = parseInt(lastID.split('-')[2], 10);
        const newIncrement = String(lastIncrement + 1).padStart(4, '0');
        return `KP-${formattedDate}-${newIncrement}`;
    } else {
        return `KP-${formattedDate}-0001`;
    }
}

module.exports = generateAutoID;