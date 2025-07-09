const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

// @desc    Register new user
// @route   POST /api/auth/register
const registerUserController = async (req, res) => {
  const { name, email, password, gender, strengths, about } = req.body;

  try {
    // check user is already exists?
    const userExists = await userModel.findOne({ email }).select('+password');
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // create new user 
    const user = await userModel.create({ name, email, password: hashedPassword, gender, strengths, about });

    if (!user) {
      return res.status(500).json({
        success: false,
        message: 'User creation failed'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Successfully Registered',
      user,
      //   _id: user._id,
      //   name: user.name,
      //   email: user.email,
      // token: generateToken(user._id),
      token: generateToken(user),
      //   role: user.role,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
const loginUserController = async (req, res) => {
  const { email, password } = req.body;

  try {
    // check user 
    const user = await userModel.findOne({ email }).select('+password');
    if (!user) return res.status(400).json({ success: false, message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Invalid email or password' });

    user.password = undefined;   // hide password

    res.status(200).json({
      success: true,
      message: 'Login Successful',
      user,
      token: generateToken(user)
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};


module.exports = { registerUserController, loginUserController }


