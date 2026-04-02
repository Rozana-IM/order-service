const express = require("express");
const router = express.Router();

const { verifyToken, verifyAdmin } = require("../middleware/auth.middleware");

const {
  createOrder,
  getOrdersByUser,
  getOrderDetails,
  getAllOrders,
  updateOrderStatus
} = require("../controllers/order.controller");

/* ================= PUBLIC / USER ================= */

router.post("/create", verifyToken, createOrder);

router.get("/", verifyToken, getOrdersByUser);
router.get("/:id", verifyToken, getOrderDetails);

/* ================= ADMIN ================= */

// ✅ View all orders
router.get("/admin/all", verifyToken, verifyAdmin, getAllOrders);

// ✅ Update order status
router.put("/update-status", verifyToken, verifyAdmin, updateOrderStatus);

module.exports = router;
