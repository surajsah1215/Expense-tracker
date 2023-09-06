const express = require('express')
const router = express.Router();
const userAunthentication = require('../middleware/auth')
const purchasecontroler = require('../controller/purchase')
const premiumFeature = require('../controller/premiumFeature')


router.get('/premiummembership/',userAunthentication.verifyToken,purchasecontroler.purchasePremium)
router.post('/updatetransactionstatus/',userAunthentication.verifyToken,purchasecontroler.updateTransactionState)
router.get('/showLeadBoard',premiumFeature.premiumFeature)

module.exports = router
