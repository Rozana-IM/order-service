const express = require("express");
const cors = require("cors");
const { createOrder, getOrdersByUser, getOrderDetails } = require("./controllers/order.controller");
const { connect } = require("./db");

const app = express();

/* ✅ Non-blocking DB connection */
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

// ROUTES
app.post("/orders", createOrder);
app.get("/orders", getOrdersByUser);
app.get("/orders/:id", getOrderDetails);

/* ✅ Health MUST always work */
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.listen(5000, "0.0.0.0", () => {
  console.log("✅ Order service LIVE");
});
