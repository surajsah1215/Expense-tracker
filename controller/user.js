const { where } = require('sequelize')
const User = require('../model/user')

exports.PostSignUp = async(req,res,next)=>{
    try{
       

    console.log(req.body)
    const name = req.body.name
    const email = req.body.email
    const phone = req.body.phone
    const pass  = req.body.pass

    const emailExists = await User.findOne({ where: { email: email } });
    if (emailExists ) {
      res.json("Email already registered")
    }

    const data = await User.create({
        name:name,
        email:email, 
        phone:phone,
        pass:pass
    })
    res.status(201).json({user:data})
}catch(err){
    console.log(err)
}

}

exports.PostLogin = async (req,res,next)=>{
    try{
    const email = req.body.email
    const pass = req.body.pass

    const emailExist = await User.findOne({where:{email:email}})
    if(emailExist){
        const passExist = await User.findOne({where:{pass:pass}})
        if(passExist){
            res.json({"message": "login succesfully"})
        }
        else{
            res.json({"message":"password inncorect"})
        }
    }
    res.json({"message":"user not found"})
    }catch(err){
        console.log(err)
    }
}