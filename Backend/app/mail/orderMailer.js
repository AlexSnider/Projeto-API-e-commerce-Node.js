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
      <table style="width:20%; border-collapse: collapse; margin-top: 10px;">
        <thead>
          <tr>
            <th style="border: 1px solid #dddddd; text-align: center; padding: 8px;">Product</th>
            <th style="border: 1px solid #dddddd; text-align: center; padding: 8px;">Quantity</th>
          </tr>
        </thead>
        <tbody>
          ${items
            .map(
              (item) =>
                `<tr>
                   <td style="border: 1px solid #dddddd; text-align: center; padding: 8px;">${item.productName}</td>
                   <td style="border: 1px solid #dddddd; text-align: center; padding: 8px;">${item.quantity}</td>
                 </tr>`
            )
            .join("")}
        </tbody>
      </table>
      <h1>Thank you for buying with us.</h1>
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
