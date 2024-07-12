const nodeMailer = require('nodemailer');
const asyncHandler = require('express-async-handler');

const sendEmail = asyncHandler(async (data, req, res) => {
  let transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL_ID,
      pass: process.env.MP,
    },
  });

  await transporter.sendMail({
    from: "'Ecommerce' <ugcseynaththenura@gmail.com>",
    to: data.to,
    subject: data.subject,
    text: data.text,
    html: data.htm,
  });

  console.log('Message sent successfully');
});

module.exports = sendEmail;



