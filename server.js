// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');
const connectDB = require('./config/db');
const session = require('express-session');
const errorHandler = require('./middlewares/error.handler');

// Load environment variables
dotenv.config();

// Connect to DB
connectDB();

// Init app
const app = express();


require('./config/passport')(passport);       // Your JWT strategy
require('./config/google.config');            // Make sure this runs
// Middlewares 
app.use(cors());
app.use(express.json());
app.use(session({ secret: process.env.JWT_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use(morgan('dev'));

// passport init + strategy
require('./config/passport')(passport);
app.use(passport.initialize());

// Routes 
app.use('/api/v1/auth', require('./routes/auth.routes'));
app.use('/api/v1/users', require('./routes/user.routes'));


// Sample Route
app.get('/', (req, res) => {
  res.send('API is running...');
});


// Route not found middleware
app.use((req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  error.status = 404;
  next(error); // Forward to error handler
})

// Register error handler as the **last middleware**
app.use(errorHandler);



// Define port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});