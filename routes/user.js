const express = require('express')

const router = express.Router();

const userControler = require('../controller/user')
const ExpenseControler = require('../controller/expense')


router.post('/signup',userControler.PostSignUp)
router.post('/login',userControler.PostLogin)
router.post('/user/addExpense',ExpenseControler.AddExpense)
router.get('/user/get-expense',ExpenseControler.getExpense)
router.delete('/delete-expense/:expenseId',ExpenseControler.deleteExpense)
module.exports = router