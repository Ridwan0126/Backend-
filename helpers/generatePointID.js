const db = require('../config/db'); 

const generatePointID = async () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); 
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}${month}${day}`; 

    try {
        const [rows] = await db.query(
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
    } catch (error) {
        console.error('Error generating Point ID:', error);
        throw new Error('Failed to generate Point ID');
    }
};

module.exports = generatePointID;