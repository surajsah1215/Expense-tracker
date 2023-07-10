const jwt = require('jsonwebtoken');
require('dotenv').config();


exports.generateAccessToken = function(id,ispremium){
    const secretKey = process.env.TOKEN
    return jwt.sign({id,ispremium},`${secretKey}`)
}