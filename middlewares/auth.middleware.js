const passport = require('passport');

// Protect any route:  app.get('/secure', protect, controllerFn)
exports.protect = passport.authenticate('jwt', { session: false });
