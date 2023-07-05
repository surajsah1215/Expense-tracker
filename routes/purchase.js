const express = require('express')
const router = express.Router();
const userAunthentication = require('../middleware/auth')
const purchasecontroler = require('../controller/purchase')
// const ExpenseControler = require('../controller/purchase')



router.get('/premiummembership/',userAunthentication.verifyToken,purchasecontroler.purchasePreimum)
router.post('/updatetransactionstatus/',userAunthentication.verifyToken,purchasecontroler.updateTransactionState)

module.exports = router
