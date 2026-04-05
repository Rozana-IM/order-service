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

console.log("getAllOrders:", getAllOrders);

/* ================= USER ================= */

router.post("/create", verifyToken, createOrder);
router.get("/", verifyToken, getOrdersByUser);
router.get("/admin/all", verifyToken, (req, res) => {
  res.send("WORKING");
});
router.get("/:id", verifyToken, getOrderDetails);

/* ================= UPDATE ================= */

router.put("/update-status", verifyToken, updateOrderStatus);

module.exports = router;
