const mongoose = require('mongoose');

// schema 
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: true,
    },
    strengths: [
      {
        type: String,
      }
    ],
    about: {
      type: String,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    }
  },
  {
    timestamps: true,
  }
);

// export 
module.exports = mongoose.model('users', userSchema);
