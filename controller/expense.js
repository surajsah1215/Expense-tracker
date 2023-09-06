const mongoose = require('mongoose');
const Expense = require('../model/expense')
const User = require('../model/user')
const Urltable = require('../model/url')
const AWS = require('aws-sdk');

const ITEMS_PER_PAGE = 10;

exports.AddExpense = async (req, res, next) => {
  try {
    const amount = req.body.amount;
    const description = req.body.description;
    const category = req.body.category;

    const expense = new Expense({
      amount,
      description,
      category,
      userId: req.user.id,
    });

    await expense.save();

    // Update user's total_amount
    const user = await User.findById(req.user.id);
    user.total_amount += amount;
    await user.save();

    res.status(201).json({ data: expense });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: err.message });
  }
};

exports.getExpense = async (req, res, next) => {
  try {
    const ITEMS_PER_PAGE = 10;
    const page = +req.query.page || 1;

    const totalItems = await Expense.countDocuments({ userId: req.user.id });

    const expenses = await Expense.find({ userId: req.user.id })
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);

    res.json({
      expenses,
      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < totalItems,
      nextPage: page + 1,
      hasPreviousPage: page > 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'something went wrong' });
  }
};

exports.deleteExpense = async (req, res, next) => {
  try {
    const id = req.params.expenseId;
    const expenseuser = await Expense.findOne({ _id: id, userId: req.user.id });

    if (!expenseuser) {
      return res.status(404).json({ success: false, message: "Expense doesn't belong to the user" });
    }

    const noofrowsdeleted = await Expense.deleteOne({ _id: id, userId: req.user.id });

    if (noofrowsdeleted.deletedCount === 0) {
      return res.status(404).json({ success: false, message: "Expense doesn't belong to the user" });
    }

    const user = await User.findById(req.user.id);
    user.total_amount -= expenseuser.amount;
    await user.save();

    res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

function uploadToS3(data, fileName) {
  try {
    const BUCKET_NAME = 'appexpense';
    const IAM_USER_KEY = process.env.IAM_USER_KEY;
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

    let s3bucket = new AWS.S3({
      accessKeyId: IAM_USER_KEY,
      secretAccessKey: IAM_USER_SECRET,
    });

    var params = {
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: data,
      ACL: 'public-read',
    };

    return new Promise((resolve, reject) => {
      s3bucket.upload(params, (err, s3response) => {
        if (err) {
          reject(err);
        } else {
          resolve(s3response.Location);
        }
      });
    });
  } catch (err) {
    res.status(500).json({ err: err });
  }
}

exports.downloadExpense = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id });
    const stringifiedExpenses = JSON.stringify(expenses);
    const userId = req.user.id;
    const fileName = `Expense${userId}/${new Date()}.txt`;
    const fileUrl = await uploadToS3(stringifiedExpenses, fileName);
    const response = await Urltable.create({
      url: fileUrl,
      userId,
    });
    res.status(200).json({ fileUrl, success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'something went wrong' });
  }
};

exports.usersAllExpenseslink = async (req, res) => {
  try {
    const userid = req.user.id;
    const result = await Urltable.find({ userId: userid });
    res.status(200).json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};
