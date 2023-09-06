const mongoose = require('mongoose');

// Define a Mongoose schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: String,
  pass: String,
  ispremium: Boolean,
  total_amount: {
    type: Number,
    default: 0,
  },
});

// Create a Mongoose model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
