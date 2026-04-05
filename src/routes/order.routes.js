const express = require("express");
const router = express.Router();

const controller = require("../controllers/order.controller"); // ✅ IMPORTANT

const { verifyToken } = require("../middleware/auth.middleware");

// 🔍 DEBUG (remove later)
console.log("CONTROLLER:", controller);

/* ================= USER ================= */

router.post("/create", verifyToken, controller.createOrder);

router.get("/", verifyToken, controller.getOrdersByUser);

router.get("/admin/all", verifyToken, controller.getAllOrders);

router.get("/:id", verifyToken, controller.getOrderDetails);

/* ================= UPDATE ================= */

router.put("/update-status", verifyToken, controller.updateOrderStatus);

module.exports = router;
