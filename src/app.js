const express = require("express");
const cors = require("cors");
const db = require("./db");
const orderRoutes = require("./routes/order.routes");

require("./workers/payment.worker");

const app = express();
const PORT = process.env.PORT || 5000;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use(express.json());
db.connect().catch(err => console.error("DB ERROR:", err));

// 🔥 HEALTH CHECKS - ORDER SERVICE SPECIFIC
app.get("/orders/health", (req, res) => res.json({status: "Order Service healthy"}));
app.get("/health", (req, res) => res.json({service: "order-service", status: "healthy"}));

// 🔥 ROUTES
app.use("/orders", orderRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Order Service LIVE on port ${PORT}`);
});
