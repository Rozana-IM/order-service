const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/auth.middleware");

const {
  createOrder,
  getOrdersByUser,
  getAllOrders,
  getOrderDetails
} = require("../controllers/order.controller");

router.post("/orders", verifyToken, createOrder);

router.get("/orders", verifyToken, getOrdersByUser);

router.get("/orders/:id", verifyToken, getOrderDetails);

router.get("/admin/orders", verifyToken, getAllOrders);

module.exports = router;
