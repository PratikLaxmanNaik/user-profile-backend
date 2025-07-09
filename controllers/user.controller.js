const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
//  Add user (Admin only)
const addUserController = async (req, res) => {
    try {
        const { name, email, gender, strengths, about, password } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const user = await User.create({ name, email, gender, strengths, about, password });
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error creating user', error: err.message });
    }
};

//  Get paginated list of users
const getUsersController = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    try {
        // search filter query
        const filter = {
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ],
        };

        const total = await User.countDocuments(filter);
        const users = await User.find(filter).skip(skip).limit(limit).select('-password');
        res.json({
            page,
            totalPages: Math.ceil(total / limit),
            totalUsers: total,
            users,
        });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch users', error: err.message });
    }
};

// Get single user
const getUserByIdController = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error getting user', error: err.message });
    }
};

// Update user


const updateUserController = async (req, res) => {
    try {
        const userId = req.params.id;
        const { name, email, password, gender, strengths, about } = req.body;

        //  Admin to update any user
        //  Users to update only their own profile
        if (req.user.role !== 'admin' && req.user._id.toString() !== userId) {
            return res.status(403).json({ message: 'Access denied: not authorized' });
        }

        // Fetch the user
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Update fields if provided
        if (name !== undefined) user.name = name;
        if (email !== undefined) user.email = email;
        if (gender !== undefined) user.gender = gender;
        if (strengths !== undefined) user.strengths = strengths;
        if (about !== undefined) user.about = about;

        // Update password only if it is provided (non-empty string)
        if (password && password.trim() !== '') {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        const updatedUser = await user.save();

        res.json({
            message: 'User updated successfully',
            user: {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                gender: updatedUser.gender,
                strengths: updatedUser.strengths,
                about: updatedUser.about,
            },
        });
    } catch (error) {
        console.error('Error in updateUser:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

//  Delete user
const deleteUserController = async (req, res) => {
    try {
        const deleted = await User.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting user', error: err.message });
    }
};


const getCurrentUserController = async (req, res) => {
    try {

        const userId = req.user._id || req.user.id || (req.user.id && req.user.id.id);
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, user });

    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
}


module.exports = { addUserController, getUsersController, getUserByIdController, updateUserController, deleteUserController, getCurrentUserController }
