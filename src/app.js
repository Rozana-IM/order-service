const express = require("express");
const cors = require("cors");  // Move up
const db = require("./db");
const orderRoutes = require("./routes/order.routes");

require("./workers/payment.worker");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

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

db.connect();

app.get("/health", (req, res) => {
  res.status(200).send("Order Service healthy");
});

app.get("/orders/health", (req, res) => {
  res.status(200).send("Order Service healthy");
});

app.use(orderRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Order Service running on port ${PORT}`);
});
