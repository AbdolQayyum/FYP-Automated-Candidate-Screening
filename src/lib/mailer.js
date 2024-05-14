import nodemailer from "nodemailer"
import bcryptjs from 'bcryptjs'
import User from '@/models/userModel';

export const sendEmail = async({email, emailType, userId}) => {

    try {

        const hashedToken = await bcryptjs.hash(userId.toString(),10)

        if(emailType === "VERIFY"){
            await User.findByIdAndUpdate(userId,{
               $set:{verifyToken : hashedToken ,
                 verifyTokenExpiry : (Date.now() + 3600000)
               }
        });

        }else if(emailType === "RESET"){
            await User.findByIdAndUpdate(userId,{
                $set:{forgotPasswordToken : hashedToken ,
                forgotPasswordTokenExpiry : (Date.now() + 3600000)
                }
        });

        }

        const transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "12bf44deb68ee5", // XX
              pass: "cc6353cf754d05" //XX these are private user and pass, so it must be in env variable
            }
          });

        const mailOptions = {
            from: 'acs@acs.ai', // sender address
            to: email, // list of receivers
            subject: emailType === 'VERIFY' ? "Verify Your Email" : "Reset Your Password", // Subject line
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}"> </a> to 
            ${emailType === "VERIFY" ? "verify your email" : "reset your password"} 
            or copy paste the link in browser.
            <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken} </p>`, // html body
          }  

          const mailResponse = await transport.sendMail
          (mailOptions)
          return mailResponse
        
    } catch (error) {

        throw new Error(error.message)
        
    }
}