const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',       // Ganti dengan host database Anda
    user: 'root',             // Ganti dengan user database Anda
    password: 'sayasaya.123', // Ganti dengan password database Anda
    database: 'pilahyuk_db'   // Ganti dengan nama database Anda
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Connected to MySQL Database');
    }
});

module.exports = db;