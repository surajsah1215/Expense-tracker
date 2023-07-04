const express = require('express')
const app = express();

const cors = require('cors')
app.use(cors())

const sequelize = require('./util/database');
const User = require('./model/user')
const Expense = require('./model/expense')



const route = require('./routes/user')
const bodyParser = require('body-parser');
app.use(bodyParser.json())

app.use(route)

User.hasMany(Expense)
Expense.belongsTo(User)


sequelize.sync()
 .then((response)=>app.listen(3000))
 .catch(err=>console.log(err))
