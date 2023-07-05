const express = require('express')

const router = express.Router();

const userControler = require('../controller/user')
const ExpenseControler = require('../controller/expense')
const userAunthentication = require('../middleware/auth')

router.post('/signup',userControler.PostSignUp)
router.post('/login',userControler.PostLogin)
router.post('/user/addExpense',userAunthentication.verifyToken,ExpenseControler.AddExpense)
router.get('/user/get-expense',userAunthentication.verifyToken,ExpenseControler.getExpense)
router.delete('/delete-expense/:expenseId',userAunthentication.verifyToken,ExpenseControler.deleteExpense)

// router.get('/purchase/premiummembership/',userAunthentication.verifyToken)
module.exports = router