const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
dotenv.config();

function sendEmail(email, username, token) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Password Reset",
    html: `<h1>Hello dear ${username},</h1>
      <p>We have received a request to reset your password.</p>
      <p>If you did not make this request, please ignore this email.</p>
      <p>To reset your password, please click on the following link:</p>
      <p><a href="${process.env.FRONTEND_URL}/reset-password/${token}">Reset Password</a></p>
      <h1>Thank you for using our service.</h1>
      `,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

module.exports = sendEmail;
