const mongoose = require('mongoose');

// Define the connection URI (replace 'your-mongodb-uri' with your actual MongoDB URI)
const mongoDBURI = 'mongodb+srv://expenseusers:1215@cluster0.m1hqzga.mongodb.net/ExpneseTracker?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose.connect(mongoDBURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Get the default connection
const db = mongoose.connection;

// Handle connection errors
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Export the MongoDB connection
module.exports = db;
