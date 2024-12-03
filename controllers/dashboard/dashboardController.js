const db = require('../../config/db');

exports.getDashboardData = async (req, res) => {
    try {
        // Query Total Daur Ulang (Yuk Angkut dan Yuk Buang)
        const [totalDaurUlang] = await db.query(`
        SELECT 
            SUM(amount) AS total_daur_ulang 
        FROM 
            (SELECT amount, status FROM yuk_angkut
            UNION ALL
            SELECT amount, status FROM yuk_buang) AS combined
        WHERE status = 'Berhasil'
        `);

        // Query Total Penjemputan (Yuk Buang dengan status "Penjemputan")
        const [totalPenjemputan] = await db.query(`
            SELECT COUNT(*) AS total_penjemputan 
            FROM yuk_angkut 
            WHERE status = 'Berhasil'
        `);

        // Query Total Pengantaran (Yuk Buang dengan status "Pengantaran")
        const [totalPengantaran] = await db.query(`
            SELECT COUNT(*) AS total_pengantaran 
            FROM yuk_buang 
            WHERE status = 'Berhasil'
        `);

        // Query Total Pengguna (Users dengan role bukan "Admin")
        const [totalPengguna] = await db.query(`
            SELECT COUNT(*) AS total_pengguna 
            FROM users 
            WHERE role != 'Admin'
        `);

        // Query Overview (Akumulasi Daur Ulang Per Bulan)
        const [overview] = await db.query(`
        SELECT 
            DATE_FORMAT(date, '%b') AS month,  -- Format '%b' menampilkan nama bulan singkat (Jan, Feb, dst)
            SUM(amount) AS total_per_month 
        FROM 
            (SELECT date, amount, status FROM yuk_angkut 
            UNION ALL 
            SELECT date, amount, status FROM yuk_buang) AS combined
        WHERE 
            status = 'Berhasil'
        GROUP BY 
            DATE_FORMAT(date, '%b'), MONTH(date)  -- Gunakan MONTH(date) untuk menjaga urutan bulan
        ORDER BY 
            MONTH(date);  -- Pastikan urutan bulan benar (Jan - Dec)
        `);

        // Kirim data ke frontend
        res.status(200).json({
            totalDaurUlang: totalDaurUlang[0]?.total_daur_ulang || 0,
            totalPenjemputan: totalPenjemputan[0]?.total_penjemputan || 0,
            totalPengantaran: totalPengantaran[0]?.total_pengantaran || 0,
            totalPengguna: totalPengguna[0]?.total_pengguna || 0,
            overview,
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ message: 'Error fetching dashboard data', error: error.message });
    }
};