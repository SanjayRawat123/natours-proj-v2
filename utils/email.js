// first install node mailer npm i nodemailer
// eslint-disable-next-line import/no-extraneous-dependencies
const nodemailer = require('nodemailer');

const sendEmail = async options =>{
    // 1) create a transporter
    console.log( "host:", process.env.EMAIL_HOST,"port:", process.env.EMAIL_PORT ,process.env.EMAIL_USERNAME,process.env.EMAIL_PASSWORD  )
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD
        }
      });
      // 2) Define the email options
  const mailOptions = {
    from: 'Sanjay <hello@sanjay.io>',
    to: options.email,
    subject: options.subject,
    text: options.message
    // html:
  };

    // 3) Actually send the email
    await transporter.sendMail(mailOptions);
}

module.exports=sendEmail;