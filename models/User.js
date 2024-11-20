// models/User.js
const db = require('../config/db');

const User = {
    findByEmail: async (email) => {
        try {
            const [results] = await db.query('SELECT * FROM users WHERE email = ? AND role = "Admin"', [email]);
            return results[0];
        } catch (error) {
            console.error('Error finding user by email:', error);
            throw error;
        }
    },

    findById: async (id) => {
        try {
            const [results] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
            return results[0];
        } catch (error) {
            console.error('Error finding user by ID:', error);
            throw error;
        }
    },

    findByRole: async (role) => {
        try {
            const [results] = await db.query('SELECT * FROM users WHERE role = ?', [role]);
            return results;
        } catch (error) {
            console.error('Error finding users by role:', error);
            throw error;
        }
    },

    updateById: async (id, data) => {
        try {
            // Destructure with conditional defaults for role and status
            const {
                name,
                email,
                number,
                address,
                role = data.role ? data.role : 'Admin', // Only set default if not provided
                status = data.status ? data.status : 'Aktif', // Adjust to DB enum value
                profile_image
            } = data;

            const fields = ['name = ?', 'email = ?', 'number = ?', 'address = ?', 'role = ?', 'status = ?', 'profile_image = ?'];
            const values = [name, email, number, address, role, status, profile_image];

            // Only include gender if provided
            if (data.gender !== undefined) { 
                fields.push('gender = ?');
                values.push(data.gender);
            }

            values.push(id); 

            const [result] = await db.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
            return result;
        } catch (error) {
            console.error('Error updating user by ID:', error);
            throw error;
        }
    },

    create: async (userData) => {
        try {
            const { name, email, number, address, role = 'Admin', status = 'Aktif', gender = 'Not Specified', profile_image = null } = userData;
            const [result] = await db.query(
                'INSERT INTO users (name, email, number, address, role, status, gender, profile_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [name, email, number, address, role, status, gender, profile_image]
            );
            return { id: result.insertId, ...userData };
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    },

    deleteById: async (id) => {
        try {
            const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
            return result;
        } catch (error) {
            console.error('Error deleting user by ID:', error);
            throw error;
        }
    },
};

module.exports = User;