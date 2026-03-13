const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrdersByUser,
  getOrderDetails,
} = require("../controllers/order.controller");

// 🔥 TEMP - NO AUTH FOR TESTING
router.post("/", createOrder);
router.get("/", getOrdersByUser);
router.get("/:id", getOrderDetails);

module.exports = router;
