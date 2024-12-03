const db = require('../../config/db');

exports.getDashboardData = async (req, res) => {
    try {
        const [totalDaurUlang] = await db.query(`
        SELECT 
            SUM(amount) AS total_daur_ulang 
        FROM 
            (SELECT amount, status FROM yuk_angkut
            UNION ALL
            SELECT amount, status FROM yuk_buang) AS combined
        WHERE status = 'Berhasil'
        `);

        const [totalPenjemputan] = await db.query(`
            SELECT COUNT(*) AS total_penjemputan 
            FROM yuk_angkut 
            WHERE status = 'Berhasil'
        `);

        const [totalPengantaran] = await db.query(`
            SELECT COUNT(*) AS total_pengantaran 
            FROM yuk_buang 
            WHERE status = 'Berhasil'
        `);

        const [totalPengguna] = await db.query(`
          SELECT COUNT(DISTINCT pengguna_id) AS total_pengguna
          FROM (
              SELECT pickup_id AS pengguna_id
              FROM yuk_angkut 
              WHERE status = 'Berhasil'
              UNION
              SELECT delivery_id AS pengguna_id
              FROM yuk_buang 
              WHERE status = 'Berhasil'
              UNION
              SELECT id AS pengguna_id
              FROM penukaran_poin 
              WHERE status = 'Berhasil' 
          ) AS pengguna
        `);
        

        const [overview] = await db.query(`
        SELECT 
            DATE_FORMAT(date, '%b') AS month,  
            SUM(CAST(amount AS DECIMAL)) AS total_per_month 
        FROM 
            (SELECT date, amount, status FROM yuk_angkut 
            UNION ALL 
            SELECT date, amount, status FROM yuk_buang) AS combined
        WHERE 
            status = 'Berhasil'
        GROUP BY 
            DATE_FORMAT(date, '%b'), MONTH(date) 
        ORDER BY 
            MONTH(date);  -- Pastikan urutan bulan benar (Jan - Dec)
        `);

        const [transactions] = await db.query(`
          SELECT 
              transaction_id,
              name,
              email,
              type,
              amount,
              (CAST(amount AS DECIMAL) * price_per_kg) AS total_harga, 
              date
          FROM (
              SELECT 
                  pickup_id AS transaction_id,
                  name,
                  email,
                  'Penjemputan' AS type,
                  amount,
                  price_per_kg,
                  date
              FROM yuk_angkut
              WHERE status = 'Berhasil'
              UNION ALL
              SELECT 
                  delivery_id AS transaction_id,
                  name,
                  email,
                  'Pengantaran' AS type,
                  amount,
                  price_per_kg,
                  date
              FROM yuk_buang
              WHERE status = 'Berhasil'
          ) AS combined
          ORDER BY date DESC
          LIMIT 5
      `);
      

        // Kirim data ke frontend
        res.status(200).json({
            totalDaurUlang: totalDaurUlang[0]?.total_daur_ulang || 0,
            totalPenjemputan: totalPenjemputan[0]?.total_penjemputan || 0,
            totalPengantaran: totalPengantaran[0]?.total_pengantaran || 0,
            totalPengguna: totalPengguna[0]?.total_pengguna || 0,
            overview,
            transactions,
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ message: 'Error fetching dashboard data', error: error.message });
    }
};