const express = require("express");
const cors = require("cors");
const db = require("./db");
const orderRoutes = require("./routes/order.routes");

require("./workers/payment.worker");

const app = express();
const PORT = process.env.PORT || 5000;

// 🔥 SIMPLE CORS THAT WORKS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://rozana-projects.online');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use(express.json());
db.connect();

// 🔥 HEALTH CHECKS
app.get("/health", (req, res) => res.send("Order Service healthy"));
app.get("/orders/health", (req, res) => res.send("Order Service healthy"));

// 🔥 FIX ROUTE: Frontend expects /orders → Backend /orders
app.use("/orders", orderRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Order Service port ${PORT}`);
});
