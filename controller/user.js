const User = require('../model/user'); 
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const helper = require('./helper');

exports.PostSignUp = async (req, res, next) => {
  try {
    const { name, email, phone, pass } = req.body;

    const emailExists = await User.findOne({ email: email });

    if (emailExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const saltRounds = 10;
    const hash = await bcrypt.hash(pass, saltRounds);

    const user = new User({
      name: name,
      email: email,
      phone: phone,
      pass: hash,
    });

    const savedUser = await user.save();

    res.status(201).json({ user: savedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.PostLogin = async (req, res, next) => {
  try {
    const { email, pass } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    bcrypt.compare(pass, user.pass, function (err, response) {
      if (err) {
        return res.status(500).json({ message: "Something went wrong" });
      }

      if (response) {
        const token = helper.generateAccessToken(user._id, user.ispremium); // for converting userid into a hash value
        return res.json({ message: "Login successfully", token: token });
      } else {
        return res.status(401).json({ message: "Password incorrect" });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};
