const express = require('express');
const passport = require('passport');
const { registerUserController, loginUserController } = require('../controllers/auth.controller');

const router = express.Router();

// routes 
router.post('/register', registerUserController);
router.post('/login', loginUserController);

// @route   GET /api/v1/auth/facebook
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

// @route   GET /api/v1/auth/facebook/callback
// @desc    Facebook OAuth callback
router.get('/facebook/callback', passport.authenticate('facebook', {
    session: false,
    failureRedirect: '/login',
}),
    (req, res) => {
        // You can generate a JWT token here and redirect or send response
        res.json({
            message: 'Facebook login successful',
            user: req.user,
        });
    }
);
module.exports = router;
