const Razorpay = require('razorpay');
const Order = require('../model/order'); 
require('dotenv').config();
const helper = require('./helper');

exports.purchasePremium = async (req, res) => {
  try {
    const rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const amount = 100;

    rzp.orders.create({ amount, currency: 'INR' }, async (err, order) => {
      if (err) {
        return res.status(403).json({ message: 'Something went wrong', err: err });
      }

      const newOrder = new Order({
        orderid: order.id,
        status: 'PENDING',
        userId: req.user._id, // Assuming you have the user's ObjectId in req.user._id
      });

      try {
        const savedOrder = await newOrder.save();
        return res.status(201).json({ order: savedOrder, key_id: rzp.key_id });
      } catch (err) {
        return res.status(403).json({ message: 'Something went wrong', err: err });
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(403).json({ message: 'Something went wrong', err: err });
  }
};

exports.updateTransactionState = async (req, res) => {
  try {
    const { payment_id, order_id } = req.body;

    const order = await Order.findOne({ orderid: order_id });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const promises = [];

    promises.push(order.updateOne({ paymentid: payment_id, status: 'SUCCESSFUL' }));
    promises.push(req.user.updateOne({ ispremium: true }));

    Promise.all(promises)
      .then(() => {
        const token = helper.generateAccessToken(req.user._id, true);
        return res.status(202).json({ success: true, message: 'Transaction successful', token: token });
      })
      .catch((err) => {
        return res.status(403).json({ message: 'Payment is not happening', err: err });
      });
  } catch (err) {
    console.error(err);
    return res.status(403).json({ message: 'Payment is not happening', err: err });
  }
};
