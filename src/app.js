const express = require("express");
const cors = require("cors");
const { createOrder, getOrdersByUser, getOrderDetails } = require("./controllers/order.controller");
const { connect } = require("./db");
const { verifyToken } = require("./middleware/auth.middleware");

const app = express();

/* DB */
connect().catch(err => console.error("DB Error:", err));

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

/* ROUTES */
const orderRoutes = require("./routes/order.routes");

app.use("/orders", verifyToken, orderRoutes);

/* HEALTH */
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

/* START */
app.listen(5000, "0.0.0.0", () => {
  console.log("✅ Order service LIVE");
});
