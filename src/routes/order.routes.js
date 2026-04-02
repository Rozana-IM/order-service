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

// NOW routes
router.put("/update-status", updateOrderStatus);

// PUBLIC
router.post("/create", verifyToken, createOrder);

// SPECIFIC FIRST
const { verifyToken, isAdmin } = require("../middleware/auth");

router.get("/admin/all", verifyToken, isAdmin, getAllOrders);
router.put("/update-status", verifyToken, isAdmin, updateOrderStatus);

// GENERAL ROUTES
router.get("/", verifyToken, getOrdersByUser);
router.get("/:id", verifyToken, getOrderDetails);

module.exports = router;
