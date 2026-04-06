const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

const client = new SESClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
  }
});

exports.sendOrderEmail = async (to, order) => {
  try {
    const params = {
      Source: process.env.EMAIL_FROM,
      Destination: {
        ToAddresses: [to]
      },
      Message: {
        Subject: {
          Data: "🛍️ LUCCI Order Confirmation"
        },
        Body: {
          Html: {
            Data: `
              <h2>Order Confirmed 🎉</h2>
              <p><b>Order ID:</b> ${order.id}</p>
              <p><b>Total:</b> ₹${order.total}</p>
              <p>Status: ${order.status}</p>
            `
          }
        }
      }
    };

    const res = await client.send(new SendEmailCommand(params));
    console.log("✅ EMAIL SENT:", res);

  } catch (err) {
    console.error("❌ EMAIL FAILED:", err);
  }
};
