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





//   const { email, subject, message } = data;
//   try {
//     const transporter = nodeMailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: process.env.EMAIL,
//         pass: process.env.PASSWORD,
//       },
//     });

//     const mailOptions = {
//       from: process.env.EMAIL,
//       to: email,
//       subject: subject,
//       text: message,
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         throw new Error(error);
//       } else {
//         res.json({
//           message: 'Email sent successfully',
//         });
//       }
//     });
//   } catch (error) {
//     throw new Error(error);
//   }
// }