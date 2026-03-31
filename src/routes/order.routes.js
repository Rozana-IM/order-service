const express = require("express");
const router = express.Router();

const {
  createOrder,
  getOrdersByUser,
  getOrderDetails,
  getAllOrders
} = require("../controllers/order.controller");

const { verifyToken, verifyAdmin } = require("../middleware/auth.middleware");

/* 🔓 PUBLIC (ONLY HEALTH handled in app.js) */

/* 🔐 USER ROUTES */
router.post("/", verifyToken, createOrder);
router.get("/", verifyToken, getOrdersByUser);

/* 🔐 ADMIN ROUTE */
router.get("/admin/all", verifyToken, verifyAdmin, getAllOrders);

/* 🔐 ORDER DETAILS */
router.get("/:id", verifyToken, getOrderDetails);

module.exports = router;
