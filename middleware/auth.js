const jwt = require('jsonwebtoken')
const User = require('../model/user')

const verifyToken = (req,res,next)=>{
    try{
    const token = req.header('Authorization')
    const secretKey = 'Suraj@sharpner'

    const userId = jwt.verify(token,`${secretKey}`)
    console.log('user>>>>>',userId)
    User.findByPk(userId).then(user=>{
        // console.log(JSON.stringify(user));
        // console.log(user)
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