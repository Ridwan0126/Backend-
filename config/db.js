const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'sayasaya.123',
    database: 'pilahyuk_db'
});

module.exports = db;