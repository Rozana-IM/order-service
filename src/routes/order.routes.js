const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/auth.middleware");

const {
  createOrder,
  getOrdersByUser,
  getAllOrders,
  getOrderDetails,
  updatePaymentStatus   // ⭐ THIS WAS MISSING
} = require("../controllers/order.controller");

/* USER ROUTES */

router.post("/orders", verifyToken, createOrder);
router.get("/orders", verifyToken, getOrdersByUser);
router.get("/orders/:id", verifyToken, getOrderDetails);

/* ADMIN */

router.get("/admin/orders", verifyToken, getAllOrders);

/* PAYMENT UPDATE */

router.post("/orders/payment-update", updatePaymentStatus);

module.exports = router;
