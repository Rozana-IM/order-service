const express = require("express");
const cors = require("cors");
const db = require("./db");
const orderRoutes = require("./routes/order.routes");

const app = express();
const PORT = process.env.PORT || 5000;

// ================= Middleware =================
app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "https://rozana-projects.online",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// ================= DB =================
db.connect();

// ================= Start SQS Worker =================
require("./workers/payment.worker");

// ================= Routes =================
app.use(orderRoutes);

// ================= Health =================
app.get("/health", (req, res) => {
  res.status(200).send("Order Service is healthy");
});

app.get("/orders/health", (req, res) => {
  res.send("Order Service healthy");
});

// ================= Start =================
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Order Service running on port ${PORT}`);
});
