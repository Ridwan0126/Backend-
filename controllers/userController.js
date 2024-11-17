const User = require('../models/User');

const userController = {
    getProfile: async (req, res) => {
        try {
            const user = await User.findById(req.userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const genderConverted = user.gender === 'Laki-laki' ? 'male' : 'female';

            console.log("Data yang dikirim ke frontend:", {
                firstName: user.name.split(' ')[0],
                lastName: user.name.split(' ').slice(1).join(' '),
                email: user.email,
                phone: user.number,
                address: user.address,
                gender: genderConverted,
                role: user.role,
                profileImage: user.profile_image
            });

            res.json({
                firstName: user.name.split(' ')[0],
                lastName: user.name.split(' ').slice(1).join(' '),
                email: user.email,
                phone: user.number,
                address: user.address,
                gender: genderConverted,
                role: user.role,
                profileImage: user.profile_image || ''
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },

    updateProfile: async (req, res) => {
        try {
            const { firstName, lastName, email, phone, address, gender, profileImage } = req.body;

            const genderInDb = gender === 'male' ? 'Laki-laki' : 'Perempuan';
            const fullName = `${firstName} ${lastName}`;

            const result = await User.updateById(req.userId, {
                name: fullName,
                email,
                number: phone,
                address,
                gender: genderInDb,
                profile_image: profileImage
            });

            if (result.affectedRows > 0) {
                const updatedUser = await User.findById(req.userId);
                res.json({
                    firstName: updatedUser.name.split(' ')[0],
                    lastName: updatedUser.name.split(' ').slice(1).join(' '),
                    email: updatedUser.email,
                    phone: updatedUser.number,
                    address: updatedUser.address,
                    gender: updatedUser.gender === 'Laki-laki' ? 'male' : 'female',
                    role: updatedUser.role,
                    profileImage: updatedUser.profile_image,
                    message: 'Profile updated successfully'
                });
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },

    getAdmins: async (req, res) => {
        try {
            const admins = await User.findByRole('Admin');
            res.json(admins);
        } catch (error) {
            console.error('Error fetching admins:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },

    addAdmin: async (req, res) => {
        try {
            const { name, email, number, address, role, status } = req.body;

            const newAdmin = { name, email, number, address, role, status };

            const result = await User.create(newAdmin);
            res.status(201).json(result);
        } catch (error) {
            console.error('Error adding admin:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },

    deleteAdmin: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await User.deleteById(id);

            if (result.affectedRows > 0) {
                res.json({ message: 'Admin berhasil dihapus' });
            } else {
                res.status(404).json({ message: 'Admin tidak ditemukan' });
            }
        } catch (error) {
            console.error('Error deleting admin:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },

    updateAdmin: async (req, res) => { // Removed 'const' here
        try {
            const { id } = req.params;
            const { name, email, number, address, role, status } = req.body;

            const result = await User.updateById(id, { name, email, number, address, role, status });

            if (result.affectedRows > 0) {
                res.json({ message: 'Admin updated successfully' });
            } else {
                res.status(404).json({ message: 'Admin not found' });
            }
        } catch (error) {
            console.error('Error updating admin:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }
};

module.exports = userController;