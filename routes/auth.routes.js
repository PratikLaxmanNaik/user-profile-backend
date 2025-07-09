const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { registerUserController, loginUserController } = require('../controllers/auth.controller');

const router = express.Router();

// routes 
router.post('/register', registerUserController);
router.post('/login', loginUserController);




// Redirect user to Google login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback route after Google login
router.get('/google/callback', passport.authenticate('google', {
  session: false,
  failureRedirect: '/login'
}), (req, res) => {
  try {
    const user = req.user;

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.redirect(`http://localhost:4200/google-auth-success?token=${token}`);
  } catch (err) {
    console.error('Google callback error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


module.exports = router;


