const express = require('express')
const app = express();

const cors = require('cors')
app.use(cors())

const sequelize = require('./util/database');
const User = require('./model/user')
const Expense = require('./model/expense')
const Order = require('./model/order')
const ForgetPassword = require('./model/forgetPassword')


const route = require('./routes/user')
const purchaseRoutes = require('./routes/purchase')
const resetPasswordRoutes = require('./routes/resetPassword')  
const bodyParser = require('body-parser');
app.use(bodyParser.json())

app.use(route)
app.use('/purchase',purchaseRoutes)
app.use('/password',resetPasswordRoutes)

User.hasMany(Expense)
Expense.belongsTo(User)

User.hasMany(Order)
Order.belongsTo(User)

User.hasMany(ForgetPassword)
ForgetPassword.belongsTo(User)

sequelize.sync()
 .then((response)=>app.listen(3000))
 .catch(err=>console.log(err))
