const uuid = require('uuid');
const sgMail = require('@sendgrid/mail');
const bcrypt = require('bcrypt');

const User = require('../model/user');
const Forgotpassword = require('../model/forgetPassword');


exports.sendEmailId = async (req,res,next)=>{
    try{const {email} = req.body
    const user = await User.findOne({where:{email}})

    if(user){
        const id = uuid.v4()
        Forgotpassword.create({id:id,userId:user.id,isActive:true})

        .catch(err=>{
            throw new Error(err)
        })
    

    sgMail.setApiKey(process.env.SENGRID_API_KEY)

    const msg = {
        to:email,
        from: 'yj.rocks.2411@gmail.com',
        subject : 'Forget Password',
        text: 'Forget your password',
        html: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`,
       
    }
    
    sgMail.send(msg).then(response =>{
        res.status(response[0].statusCode).json({message: 'Link to reset password sent to your mail ', sucess: true})
    })
    .catch((error) => {
        throw new Error(error);
    })
    
}else {
    throw new Error('User doesnt exist')
}

}catch(err){
    console.log(err)
    res.status(500).json({'message': err})
}
    

}


exports.resetpassword = (req, res) => {
    const id =  req.params.id;
    Forgotpassword.findOne({ where : { id }}).then(forgotpasswordrequest => {
        if(forgotpasswordrequest && forgotpasswordrequest.isActive == 1){
            forgotpasswordrequest.update({ active: false});
            res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>

                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`
                                )
            res.end()

        }
    })
}


exports.updatepassword = async (req, res) => {

    try {
        const { newpassword } = req.query;
        const { resetpasswordid } = req.params;
       const resetpasswordrequest = await Forgotpassword.findOne({ where : { id: resetpasswordid }})
       const user = await User.findOne({where: { id : resetpasswordrequest.userId}})
                // console.log('userDetails', user)
                if(user) {
                    //encrypt the password

                    const saltRounds = 10;
                    bcrypt.genSalt(saltRounds, function(err, salt) {
                        if(err){
                            console.log(err);
                            throw new Error(err);
                        }
                        bcrypt.hash(newpassword, salt, function(err, hash) {
                            // Store hash in your password DB.
                            if(err){
                                console.log(err);
                                throw new Error(err);
                            }
                            user.update({ password: hash }).then(() => {
                                res.status(201).json({message: 'Successfuly update the new password'})
                            })
                        });
                    });
            } else{
                return res.status(404).json({ error: 'No user Exists', success: false})
            }
           
    } catch(error){
        return res.status(403).json({ error, success: false } )
    }

}