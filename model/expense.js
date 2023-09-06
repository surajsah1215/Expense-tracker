const mongoose = require('mongoose');

// Define a Mongoose schema
const expenseSchema = new mongoose.Schema({
  amount: Number,
  description: String,
  category: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference the User model
  },
});

// Create a Mongoose model from the schema
const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
