const db = require('../config/db');

const User = {
    findByEmail: (email) => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM users WHERE email = ? AND role = "Admin"', [email], (err, results) => {
                if (err) reject(err);
                else resolve(results[0]);
            });
        });
    },

    findById: (id) => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
                if (err) reject(err);
                else resolve(results[0]);
            });
        });
    },

    findByRole: (role) => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM users WHERE role = ?', [role], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    },

    updateById: (id, data) => {
        const { name, email, number, address, gender, profile_image } = data;
        return new Promise((resolve, reject) => {
            db.query(
                'UPDATE users SET name = ?, email = ?, number = ?, address = ?, gender = ?, profile_image = ? WHERE id = ?',
                [name, email, number, address, gender, profile_image, id],
                (err, result) => {
                    if (err) {
                        console.error('Error updating user:', err);
                        reject(err);
                    } else {
                        resolve(result);
                    }
                }
            );
        });
    },

    create: (userData) => {
        return new Promise((resolve, reject) => {
            const { name, email, number, address, role, status, gender = 'Not Specified', profile_image = null } = userData;
            db.query(
                'INSERT INTO users (name, email, number, address, role, status, gender, profile_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [name, email, number, address, role, status, gender, profile_image],
                (err, result) => {
                    if (err) {
                        console.error('Error creating user:', err);
                        reject(err);
                    } else {
                        resolve({ id: result.insertId, ...userData });
                    }
                }
            );
        });
    },

    deleteById: (id) => {
        return new Promise((resolve, reject) => {
            db.query('DELETE FROM users WHERE id = ?', [id], (err, result) => {
                if (err) {
                    console.error('Error deleting user:', err);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },
};

module.exports = User;