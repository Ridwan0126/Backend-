const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/user/User');

const authController = {
    login: async (req, res) => {
        const { email, password } = req.body;
        try {
            const user = await User.findByEmail(email);
            if (!user) {
                return res.status(404).json({ message: 'Admin not found' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Incorrect password' });
            }

            const token = jwt.sign({ id: user.id, role: user.role }, process.env.SECRET_KEY, { expiresIn: '1h' });
            res.status(200).json({ 
                token, 
                user: { 
                    id: user.id, 
                    name: user.name, 
                    email: user.email, 
                    number: user.number, 
                    address: user.address, 
                    gender: user.gender, 
                    role: user.role 
                } 
            });
        } catch (error) {
            console.error('Error during login:', error);
            res.status(500).json({ message: 'Server error', error });
        }
    },
};

module.exports = authController;