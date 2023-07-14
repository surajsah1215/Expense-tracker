const jwt = require('jsonwebtoken')
const User = require('../model/user')
require('dotenv').config();


const verifyToken = (req,res,next)=>{
    try{
    const token = req.header('Authorization')
    const secretKey = process.env.TOKEN

    const userId = jwt.verify(token,`${secretKey}`)//decrypting userId hashcode to {id,ispremium,iat}
    User.findByPk(userId['id']).then(user=>{
        // console.log('userr>>>',JSON.stringify(user));
        req.user = user
        next()
    }).catch(err=>{
        console.log(err);
    })
        
    
}catch(err){
    console.log(err)
    res.status(500).Json({sucess:false})
}
}

module.exports ={
    verifyToken
}