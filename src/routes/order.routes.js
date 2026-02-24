const express = require("express");
const router = express.Router();

const {
  createOrder,
  getOrdersByUser,
  getAllOrders,
} = require("../controllers/order.controller");

router.post("/orders", createOrder);
router.get("/orders/:userId", getOrdersByUser);
router.get("/admin/orders", getAllOrders);

module.exports = router;
