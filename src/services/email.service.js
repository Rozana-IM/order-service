const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendOrderEmail = async (email, order) => {
  try {

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "LUCCI Order Confirmation",
      html: `
        <h2>Order Confirmed 🎉</h2>
        <p><b>Order ID:</b> ${order.id}</p>
        <p><b>Total:</b> ₹${order.total}</p>
        <p>Status: ${order.status}</p>
        <br/>
        <p>Your delivery will arrive in 2 days 🚚</p>
      `
    });

    console.log("✅ Email sent");

  } catch (err) {
    console.error("❌ Email error:", err.message);
  }
};
