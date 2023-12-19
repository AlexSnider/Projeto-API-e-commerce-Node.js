const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
dotenv.config();

function sendEmail(user, status, order_total_price, payment_method, items) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: process.env.EMAIL,
    subject: "Order Confirmation",
    html: `<h1>Hello dear ${user.username},</h1>
      <p>Your order status is <b>${status}</b>.</p>
      <p>Your total price is $${order_total_price}.</p>
      <p>Payment method is ${payment_method}.</p>
      <p>Order items:</p>
      <div>
      <ul>
      ${items
        .map(
          (item) =>
            `<li style="list-style: none;"> Product: ${item.productId} <br/> Quantity: ${item.quantity}</li>`
        )
        .join("")}
      <ul/>
      </div>
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
