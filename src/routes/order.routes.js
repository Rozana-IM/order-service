const express = require("express");
const router = express.Router();

const {
  createOrder,
  getOrdersByUser,
  getOrderDetails,
  getAllOrders
} = require("../controllers/order.controller");

// USER
router.post("/", createOrder);
router.get("/", getOrdersByUser);
router.get("/:id", getOrderDetails);

// ADMIN
router.get("/admin/all", getAllOrders);

module.exports = router;
