const express = require("express");
const router = express.Router();

const {
  createOrder,
  getOrdersByUser,
  getOrderDetails,
  getAllOrders
} = require("../controllers/order.controller");

const { verifyToken, verifyAdmin } = require("../middleware/auth.middleware");

// PUBLIC
router.post("/create", createOrder);

// SPECIFIC FIRST
router.get("/admin/all", verifyToken, verifyAdmin, getAllOrders);

// GENERAL ROUTES
router.get("/", verifyToken, getOrdersByUser);
router.get("/:id", verifyToken, getOrderDetails);

module.exports = router;
