const jwt = require('jsonwebtoken');


exports.generateAccessToken = function(id,ispremium){
    const secretKey = 'Suraj@sharpner'
    return jwt.sign({id,ispremium},`${secretKey}`)
}