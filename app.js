const express = require('express');
const app = express();
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const User = require('./model/user');
const Expense = require('./model/expense');
const Order = require('./model/order');
const ForgetPassword = require('./model/forgetPassword');
const Url = require('./model/url');
const db = require('./util/database'); // Import the Mongoose connection

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'views')));

// Routes

const route = require('./routes/user');
const purchaseRoutes = require('./routes/purchase');
const resetPasswordRoutes = require('./routes/resetPassword');
app.use(route);
app.use('/purchase', purchaseRoutes);
app.use('/password', resetPasswordRoutes);

// Serve static files
app.use((req, res) => {
  res.sendFile(path.join(__dirname, `views/${req.url}`));
});

// Setup logging
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {
  flags: 'a',
});
app.use(helmet());
app.use(compression());
app.use(morgan('combined', { stream: accessLogStream }));

// Mongoose Schema Relationships 
// User.hasMany(Expense);
// Expense.belongsTo(User);

// User.hasMany(Order);
// Order.belongsTo(User);

// User.hasMany(ForgetPassword);
// ForgetPassword.belongsTo(User);

// User.hasMany(Url);
// Url.belongsTo(User);

// Start the server
const PORT = process.env.PORT || 3000;
db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
