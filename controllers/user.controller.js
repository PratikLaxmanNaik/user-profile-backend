const User = require('../models/user.model');

// @desc Add user (Admin only)
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

// @desc Get paginated list of users
const getUsersController = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    try {
        const total = await User.countDocuments();
        const users = await User.find().skip(skip).limit(limit).select('-password');
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

// @desc Get single user
const getUserByIdController = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error getting user', error: err.message });
    }
};

// @desc Update user
const updateUserController = async (req, res) => {
    try {
        const { name, gender, strengths, about } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { name, gender, strengths, about },
            { new: true },
        );
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error updating user', error: err.message });
    }
};

// @desc Delete user
const deleteUserController = async (req, res) => {
    try {
        const deleted = await User.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting user', error: err.message });
    }
};

module.exports = { addUserController, getUsersController, getUserByIdController, updateUserController, deleteUserController }
