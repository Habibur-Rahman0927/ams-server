
const nodemailer = require('nodemailer');


const sendEmail = (to, url, txt) => {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: 'devtarded@gmail.com',
        pass: 'wztxnlgtgvtydddm',
        },
    });

    const details = {
        from: 'devtarded@gmail.com',
        to: to,
        subject: "User Attendens",
        text: txt,
        html: `
        <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
        <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to the User Attendens Website</h2>
        <p>Congratulations! You're almost set to start using Attendence System.
            Just click the button below to validate your email address.
        </p>
        
        <div style="text-align: center">
        <a href=${url} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">${txt}</a>
        </div>
    
        <p>If the button doesn't work for any reason, you can also click on the link below:</p>
    
        <div>${url}</div>
        </div>
        `
      };
      
      
      transporter.sendMail(details, (err) =>{
        if(err){
            console.log(err)
        }else{
            console.log("email sent sucessfully");
        }
      })

    };
    
module.exports = sendEmail;
