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
      required: function () {
        return !this.googleId; // password required if NOT using Google
      },
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: function () {
        return !this.googleId; // Gender required if NOT using Google
      },
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
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true
    },
  },
  {
    timestamps: true,
  }
);

// export 
module.exports = mongoose.model('users', userSchema);
