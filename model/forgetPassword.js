const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
// Define a Mongoose schema
const forgetPasswordSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4, // Generate a UUID for the _id field
  },
  isActive: Boolean,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference the User model
  },
});

// Create a Mongoose model from the schema
const ForgetPassword = mongoose.model('ForgetPassword', forgetPasswordSchema);

module.exports = ForgetPassword;
