require('dotenv').config();
const nodemailer = require("nodemailer");

exports.sendAlert=async(message)=> {
  try {
    console.log('alert')
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"Mutual Fund Tracker" <${process.env.EMAIL_USER}>`,
      to: process.env.ALERT_EMAIL_TO,
      subject: "Fund Update Failure Alert",
      text: 'message'
    };

    await transporter.sendMail(mailOptions);
    console.log("Alert email sent:", message);
  } catch (err) {
    console.error("Failed to send alert email:", err.message);
  }
}

