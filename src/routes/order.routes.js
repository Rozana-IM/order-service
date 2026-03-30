const express = require("express");
const router = express.Router();

const {
  createOrder,
  getOrdersByUser,
  getOrderDetails,
  getAllOrders
} = require("../controllers/order.controller");

const { verifyAdmin } = require("../middleware/auth.middleware");

// USER ROUTES
router.post("/", createOrder);
router.get("/", getOrdersByUser);
router.get("/:id", getOrderDetails);

// 🔥 ADMIN ROUTE (IMPORTANT)
router.get("/admin/all", verifyAdmin, getAllOrders);

module.exports = router;
