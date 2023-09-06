const mongoose = require('mongoose');

// Define a Mongoose schema
const urlSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference the User model
  },
});

// Create a Mongoose model from the schema
const Urltable = mongoose.model('Urltable', urlSchema);

module.exports = Urltable;
