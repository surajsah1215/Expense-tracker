const uuid = require('uuid');
const bcrypt = require('bcrypt');
require('dotenv').config();
const User = require('../model/user');
const Forgotpassword = require('../model/forgetPassword');


const SibApiV3Sdk = require('sib-api-v3-sdk');

exports.sendemail = async(req,res,next) => {

try{   
const {email} = req.body
var defaultClient = SibApiV3Sdk.ApiClient.instance;

var apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.API_KEY

const sendinblue = new SibApiV3Sdk.TransactionalEmailsApi();


const user = await User.findOne({where:{email}})
    if(user){
        const id = uuid.v4()
        Forgotpassword.create({id:id,userId:user.id,isActive:true})
        .catch(err=>{
            throw new Error(err)
        })

        
        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        sendSmtpEmail.sender = { name: 'Reset Password', email: 'expenseTracker@gmail.com' };
        sendSmtpEmail.to = [{ email: email }];
        sendSmtpEmail.subject = 'This is the link to change your password';
        sendSmtpEmail.textContent  = 'click here to reset your password';
        sendSmtpEmail.htmlContent   =  `<a href="http://3.18.101.154:3000/password/resetpassword/${id}">Reset password</a>`


        sendinblue.sendTransacEmail(sendSmtpEmail)
        .then((response) => {
            console.log('message sent successfully',response)
            res.status(200).json({ message: 'Email sent successfully' });
        })
        .catch((error) => {
            console.error('Error sending email:', error);
            res.status(500).json({ error: 'Failed to send email' });
        });

       
    }

    else {
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
            forgotpasswordrequest.update({ isActive: false});
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
        console.log('req.quer>>>>',req.query)
        console.log('req.params>>>>',req.params)
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
                            user.update({ pass: hash }).then(() => {
                                res.status(201).json({message: 'Successfuly update the new password'})
                            })
                        });
                    });
            } else{
                return res.status(404).json({ error: 'No user Exists', success: false})
            }
           
    } catch(error){
        console.log(error)
        return res.status(403).json({ error, success: false } )
    }

}



