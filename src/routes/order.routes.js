const express = require("express");
const router = express.Router();

const controller = require("../controllers/order.controller");

const { verifyToken } = require("../middleware/auth.middleware");

// ✅ DEBUG ALL FUNCTIONS
console.log("CONTROLLER DEBUG:", controller);

/* ================= USER ================= */

router.post("/create", verifyToken, controller.createOrder);

router.get("/", verifyToken, controller.getOrdersByUser);

// TEMP safe route
router.get("/admin/all", verifyToken, (req, res) => {
  res.send("WORKING");
});

router.get("/:id", verifyToken, controller.getOrderDetails);

/* ================= UPDATE ================= */

router.put("/update-status", verifyToken, controller.updateOrderStatus);

module.exports = router;
