const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "https://rozana-projects.online",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Connect to DB
db.connect();

// Routes
app.get("/orders", (req, res) => {
  db.pool.query("SELECT * FROM orders", (err, results) => {
    if (err) {
      console.error("❌ Error fetching orders:", err.message);
      return res.status(500).json({ error: "Database error" });
    }

    res.status(200).json(results);
  });
});

// Health Check
app.get("/health", (req, res) => {
  res.status(200).send("Order Service is healthy");
});

// Start Server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Order Service running on port ${PORT}`);
});
