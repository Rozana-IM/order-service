const express = require("express");
const cors = require("cors");
const { createOrder, getOrdersByUser, getOrderDetails } = require("./controllers/order.controller");

const app = express();

app.use(express.json());

app.use(cors({
  origin: [
    "https://rozana-projects.online",
    "https://www.rozana-projects.online",
    "https://d1u1ckd80xkseo.cloudfront.net"
  ],
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: true
}));

app.options("*", cors());

// ROUTES
app.post("/orders", createOrder);
app.get("/orders", getOrdersByUser);
app.get("/orders/:id", getOrderDetails);

app.get("/health", (req, res) => {
  res.json({ status: "healthy" });
});

app.listen(5000, "0.0.0.0", () => {
  console.log("✅ Order service LIVE");
});
