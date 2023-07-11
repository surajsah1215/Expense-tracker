const express = require('express')
const app = express();
const helmet = require('helmet')
const compression = require('compression')
const morgan = require('morgan')
const fs =  require('fs')
const path = require('path')
const cors = require('cors')
app.use(cors())
require('dotenv').config();


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

app.use((req,res)=>{
    res.sendFile(path.join(__dirname,`views/${req.url}`))
})

const accesLogStream = fs.createWriteStream(path.join(__dirname,'access.log'),{flags:'a'})

app.use(helmet())
app.use(compression())
app.use(morgan('combined',{stream:accesLogStream}))

User.hasMany(Expense)
Expense.belongsTo(User)

User.hasMany(Order)
Order.belongsTo(User)

User.hasMany(ForgetPassword)
ForgetPassword.belongsTo(User)

sequelize.sync()
 .then((response)=>app.listen(process.env.PORT||3000))
 .catch(err=>console.log(err))
