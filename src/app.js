const express = require("express");
const cors = require("cors");
const db = require("./db");
const orderRoutes = require("./routes/order.routes");

// ✅ START SQS WORKER FIRST
require("./workers/payment.worker");

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ FIXED CORS
const allowedOrigins = [
  "https://rozana-projects.online",
  "https://d1u1ckd80xkseo.cloudfront.net",
  "http://localhost:3000"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// ✅ DB CONNECT
db.connect();

// ✅ HEALTH CHECKS (Required for ALB)
app.get("/health", (req, res) => res.status(200).send("Order Service healthy"));
app.get("/orders/health", (req, res) => res.status(200).send("Order Service healthy"));

// ✅ ROUTES
app.use("/", orderRoutes);

// 404
app.use((req, res) => res.status(404).json({ error: "Route not found" }));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Order Service running on port ${PORT}`);
});
