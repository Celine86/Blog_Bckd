const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
      user: process.env.MAIL_ACCOUNT,
      pass: process.env.MAIL_PSWD
  }
})

exports.sendEmail = (to, subject, html) => {

    const email_message = {
        from: process.env.MAIL_ACCOUNT,
        to: to,
        subject: subject,
        text: html
    };
    
    transporter.sendMail(email_message)    
}