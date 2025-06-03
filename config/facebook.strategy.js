// config/facebook.strategy.js

const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/user.model'); // Assuming you have a User model

passport.use(
    new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            callbackURL: '/api/v1/auth/facebook/callback',
            profileFields: ['id', 'displayName', 'emails'],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0]?.value;
                const existingUser = await User.findOne({ email });

                if (existingUser) {
                    return done(null, existingUser);
                }

                const newUser = new User({
                    name: profile.displayName,
                    email,
                    // You can set a default password or leave it blank if only OAuth
                    provider: 'facebook',
                });

                await newUser.save();
                done(null, newUser);
            } catch (err) {
                done(err, null);
            }
        }
    )
);
