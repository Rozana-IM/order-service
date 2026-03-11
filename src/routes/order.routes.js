const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/auth.middleware");

const {
  createOrder,
  getOrdersByUser,
  getAllOrders,
  getOrderDetails,
  updatePaymentStatus
} = require("../controllers/order.controller");


/* =========================
   USER ROUTES
========================= */

// Create order
router.post("/orders", verifyToken, createOrder);

// Get logged-in user orders
router.get("/orders", verifyToken, getOrdersByUser);

// Get specific order
router.get("/orders/:id", verifyToken, getOrderDetails);


/* =========================
   ADMIN ROUTES
========================= */

// Get all orders (admin)
router.get("/admin/orders", verifyToken, getAllOrders);


/* =========================
   PAYMENT SERVICE ROUTE
========================= */

// Called by payment service / SQS worker
router.post("/orders/:id/payment", updatePaymentStatus);


module.exports = router;
