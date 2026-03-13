const express = require("express");
const cors = require("cors");
const { createOrder, getOrdersByUser, getOrderDetails } = require("./controllers/order.controller");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

// 🔥 ALL DOMAINS CORS
app.use(cors({
  origin: true,
  credentials: true
}));

// 🔥 DIRECT ROUTES - NO SUBPATHS
app.post("/orders", createOrder);
app.get("/orders", getOrdersByUser);
app.get("/orders/:id", getOrderDetails);
app.get("/health", (req, res) => res.json({status: "healthy"}));

app.listen(5000, "0.0.0.0", () => {
  console.log("✅ Order service LIVE");
});
