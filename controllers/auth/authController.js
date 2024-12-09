const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/user/User');

const authController = {
    register: async (req, res) => {
        try {
            const { name, email, password, confirmPassword } = req.body;

            if (!name || !email || !password || !confirmPassword) {
                return res.status(400).json({ message: 'Nama, email, password, dan konfirmasi password harus diisi' });
            }

            if (password !== confirmPassword) {
                return res.status(400).json({ message: 'Password dan konfirmasi password tidak cocok' });
            }

            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({ message: 'Email sudah terdaftar' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            console.log('Hashed password:', hashedPassword);

            const newUser = {
                name,
                email,
                password: hashedPassword,
                number: null,
                address: null,
                gender: 'Laki-laki',
                role: 'User',
                status: 'aktif',
                profile_image: null,
                birthdate: null,
            };

            console.log('New User Data:', newUser);

            await User.create(newUser);

            res.status(201).json({ message: 'User created successfully' });
        } catch (error) {
            console.error('Error during registration:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },



    login: async (req, res) => {
        const { email, password } = req.body;

        try {
            const user = await User.findByEmail(email);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Incorrect password' });
            }

            const token = jwt.sign(
                { id: user.id, role: user.role },
                process.env.SECRET_KEY, 
                { expiresIn: '1h' }
            );

            res.status(200).json({
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    number: user.number,
                    address: user.address,
                    gender: user.gender,
                    role: user.role,
                    status: user.status, 
                },
            });
        } catch (error) {
            console.error('Error during login:', error);
            res.status(500).json({ message: 'Server error', error });
        }
    },
};

module.exports = authController;