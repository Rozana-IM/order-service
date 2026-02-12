const express = require("express");
const cors = require("cors"); 
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({
  origin: "https://rozana-projects.online", // replace with real frontend domain
}));
 
app.get("/orders", (req, res) => {
  res.json([
    { orderId: 101, product: "Laptop" },
    { orderId: 102, product: "Phone" }
  ]);
});
 
app.get("/health", (req, res) => {
  res.send("Order Service is healthy");
});
 
app.listen(PORT, "0.0.0.0", () => {
  console.log(⁠ Order Service running on port ${PORT} ⁠);
});
