const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/auth.middleware");
const {
  createOrder,
  getOrdersByUser,
  getAllOrders,
} = require("../controllers/order.controller");

/* USER */
router.post("/orders", verifyToken, createOrder);
router.get("/orders", verifyToken, getOrdersByUser);
router.get("/admin/orders", verifyToken, getAllOrders);

module.exports = router;
