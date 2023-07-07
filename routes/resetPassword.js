const express = require('express')

const router = express.Router();

const forget = require('../controller/forgetPassword')

router.post('/forgetpassword',forget.sendEmailId)

router.get('/password/resetpassword/:id',forget.resetpassword)

router.get('/updatepassword/:resetpasswordid', forget.updatepassword)

module.exports = router