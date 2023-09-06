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


const user = await User.findOne({ email });
    if(user){
        const id = uuid.v4()
      
        const newForgotPasswordRequest = new ForgotPassword({
            _id: id,
            userId: user._id,
            isActive: true,
          });
    
          await newForgotPasswordRequest.save();

        
        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        sendSmtpEmail.sender = { name: 'Reset Password', email: 'expenseTracker@gmail.com' };
        sendSmtpEmail.to = [{ email: email }];
        sendSmtpEmail.subject = 'This is the link to change your password';
        sendSmtpEmail.textContent  = 'click here to reset your password';
        sendSmtpEmail.htmlContent   =  `<a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`


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

        ForgotPassword.findOne({ _id: id })
            .then(async (forgotPasswordRequest) => {
              if (forgotPasswordRequest && forgotPasswordRequest.isActive === true) {
                await forgotPasswordRequest.updateOne({ isActive: false });        
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
    
        const resetPasswordRequest = await ForgotPassword.findOne({ _id: resetpasswordid });
    
        if (resetPasswordRequest) {
          const user = await User.findOne({ _id: resetPasswordRequest.userId });
    
          if (user) {
            // Encrypt the password
            const saltRounds = 10;
            bcrypt.genSalt(saltRounds, (err, salt) => {
              if (err) {
                console.error(err);
                throw new Error(err);
              }
              bcrypt.hash(newpassword, salt, async (err, hash) => {
                if (err) {
                  console.error(err);
                  throw new Error(err);
                }
                await user.updateOne({ pass: hash });
                res.status(201).json({ message: 'Successfully updated the new password' });
              });
            });
          } else {
            return res.status(404).json({ error: 'No user exists', success: false });
          }
        }
      } catch (error) {
        console.error(error);
        return res.status(403).json({ error, success: false });
      }

}



