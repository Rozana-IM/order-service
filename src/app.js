const express = require("express");
const cors = require("cors");
const db = require("./db");
const orderRoutes = require("./routes/order.routes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use(cors({
  origin: process.env.FRONTEND_URL || "https://rozana-projects.online",
  credentials: true
}));

// DB connection
db.connect();

/* HEALTH ROUTE (PUBLIC) */

app.get("/orders/health", (req,res)=>{
  res.send("Order Service healthy");
});

/* ORDER ROUTES (PROTECTED) */

app.use(orderRoutes);

app.listen(PORT,"0.0.0.0",()=>{
  console.log(`✅ Order Service running on port ${PORT}`);
});
