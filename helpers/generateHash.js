const bcrypt = require('bcrypt');

bcrypt.hash('admin1234', 10, (err, hash) => {
    if (err) throw err;
    console.log('Hashed password:', hash);
});