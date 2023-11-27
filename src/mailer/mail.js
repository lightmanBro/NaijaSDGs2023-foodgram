const nodemailer = require('nodemailer');

const sendEmail = async options => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    })
    //Define email options
    const emailOptions = {
        from: 'Foodgram',
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html || '',
    };

    await transporter.sendMail(emailOptions)
}


module.exports = sendEmail;


/*Host:
  sandbox.smtp.mailtrap.io
  Port:
  25 or 465 or 587 or 2525
  Username:
  4a4d1f588978f8
  Password:
  a1b308a252d8d6
  Auth:
  PLAIN, LOGIN and CRAM-MD5
  TLS:
  Optional (STARTTLS on all ports)
  */