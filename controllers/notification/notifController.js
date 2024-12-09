const db = require('../../config/db'); 

const getPendingRequests = async (req, res) => {
    const query = "SELECT COUNT(*) AS total_proses FROM yuk_angkut WHERE status = 'Proses'";

    try {
        // Use the promise-based query method
        const [rows] = await db.execute(query);
        
        const totalProses = rows[0].total_proses;
        const notifications = [
            {
                id: 1,
                title: 'Permintaan Baru',
                description: `Ada ${totalProses} permintaan penjemputan sampah baru`,
                time: 'Baru saja',
                avatar: '/path/to/avatar1.png'  
            },
            {
                id: 2,
                title: 'Pembayaran Berhasil',
                description: 'Pembayaran untuk order #12345 telah berhasil',
                time: '5m yang lalu',
                avatar: '/path/to/avatar2.png'  
            },
            {
                id: 3,
                title: 'Pengingat',
                description: 'Jadwal penjemputan sampah untuk hari ini',
                time: '1h yang lalu',
                avatar: '/path/to/avatar3.png'  
            }
        ];

        res.status(200).json(notifications);
    } catch (err) {
        console.error('Error fetching pending requests:', err);
        return res.status(500).json({ error: 'Failed to fetch pending requests' });
    }
};

module.exports = { getPendingRequests };