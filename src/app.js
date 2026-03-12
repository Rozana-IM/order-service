const express = require("express");
const cors = require("cors");
const db = require("./db");
const orderRoutes = require("./routes/order.routes");

/* START SQS WORKER */
require("./workers/payment.worker");

const app = express();
const PORT = process.env.PORT || 5000;

/* ===============================
MIDDLEWARE
=============================== */

app.use(express.json());

const cors = require("cors");

app.use(cors({
  origin: [
    "https://rozana-projects.online",
    "https://d1u1ckd80xkseo.cloudfront.net"
  ],
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: true
}));

app.options("*", cors());

/* ===============================
DATABASE CONNECTION
=============================== */

db.connect();

/* ===============================
HEALTH ROUTES (NO AUTH)
Used by ALB health checks
=============================== */

app.get("/health", (req, res) => {
  res.status(200).send("Order Service healthy");
});

app.get("/orders/health", (req, res) => {
  res.status(200).send("Order Service healthy");
});

/* ===============================
API ROUTES
=============================== */

app.use(orderRoutes);

/* ===============================
404 HANDLER
=============================== */

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

/* ===============================
SERVER START
=============================== */

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Order Service running on port ${PORT}`);
});
