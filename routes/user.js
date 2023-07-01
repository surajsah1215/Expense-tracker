const express = require('express')

const router = express.Router();

const userControler = require('../controller/user')


router.post('/signup',userControler.PostSignUp)

module.exports = router