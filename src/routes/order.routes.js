const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const {
  createOrder,
  getOrdersByUser,
  getAllOrders,
} = require("../controllers/order.controller");

router.post("/orders", auth, createOrder);
router.get("/orders", auth, getOrdersByUser);
router.get("/admin/orders", auth, getAllOrders);

module.exports = router;
