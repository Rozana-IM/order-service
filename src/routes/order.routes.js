const express = require("express");
const router = express.Router();

const {
  createOrder,
  getOrdersByUser,
  getOrderDetails,
  getAllOrders,
  updateOrderStatus
} = require("../controllers/order.controller");

const { verifyToken } = require("../middleware/auth.middleware");

/* ================= USER ================= */

router.post("/create", verifyToken, createOrder);
router.get("/", verifyToken, getOrdersByUser);
router.get("/:id", verifyToken, getOrderDetails);

/* ================= ADMIN ================= */

router.get("/admin/all", verifyToken, getAllOrders);

/* ================= UPDATE ================= */

router.put("/update-status", verifyToken, updateOrderStatus);

module.exports = router;
