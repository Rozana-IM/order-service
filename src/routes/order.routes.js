const express = require("express");
const router = express.Router();

const {
  createOrder,
  getOrdersByUser,
  getOrderDetails,
  getAllOrders
} = require("../controllers/order.controller");

const { verifyToken, verifyAdmin } = require("../middleware/auth.middleware");

// PUBLIC ROUTE (VERY IMPORTANT)
router.post("/", createOrder);

// PROTECTED ROUTES
router.get("/", verifyToken, getOrdersByUser);
router.get("/:id", verifyToken, getOrderDetails);

/* 🔐 ADMIN ROUTE */
router.get("/admin/all", verifyToken, verifyAdmin, getAllOrders);

module.exports = router;
