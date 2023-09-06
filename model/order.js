const mongoose = require('mongoose');

// Define a Mongoose schema
const orderSchema = new mongoose.Schema({
  paymentid: String,
  orderid: String,
  status: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference the User model
  },
});

// Create a Mongoose model from the schema
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
