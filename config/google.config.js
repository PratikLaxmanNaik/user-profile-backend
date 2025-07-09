const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const User = require('../models/user.model');


passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/v1/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user exists by Google ID
    let existingUser = await User.findOne({ googleId: profile.id });
    if (existingUser) return done(null, existingUser);
    // If not found by Google ID, check if user exists by email 
    const email = profile.emails?.[0]?.value || '';
    if (email) {
      user = await User.findOne({ email });
      if (user) {
        // Link Google ID to existing email user
        user.googleId = profile.id;
        await user.save();
        return done(null, user);
      }
    }


    const newUser = await User.create({
      name: profile.displayName,
      email: profile.emails?.[0]?.value || '',
      googleId: profile.id,
      role: 'user', // Default role
    });

    done(null, newUser);
  } catch (err) {
    done(err, null);
  }
}));

// For session support (optional)
// passport.serializeUser((user, done) => done(null, user));
// passport.deserializeUser((obj, done) => done(null, obj));
