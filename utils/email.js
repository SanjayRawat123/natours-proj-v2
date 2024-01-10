// first install node mailer npm i nodemailer
const nodemailer = require('nodemailer');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Sanjay Rawat <${process.env.EMAIL_FROM}>`;
  }


  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      //Sendgrid
      return 1;
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });

  }

 async send(template, subject) {
    // 1) Render HTML based
    const html = `
                  <!DOCTYPE html>
                  <html>
                  <head>
                    <title>${subject}</title>
                  </head>
                  <body>
                    <div style="font-family: Arial, sans-serif; padding: 20px;">
                      <h1>${subject}</h1>
                      <p>Hello,</p>
                      <p>This is a sample email template.</p>
                      <p>You can customize this template with dynamic content.</p>
                    </div>
                  </body>
                  </html>
                  `;
    // 2) Define email options here
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text: htmlToText.fromString(html),
      html
    };

    //3) create transport and send email 
   
      await  this.newTransport().sendMail(mailOptions);
   

  }

 async sendWelcome() {
   await this.send('welcome', "Welcome to the Sanjay's family !");
  }

};

