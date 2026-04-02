const db = require("../db");

// =================================================
// ================= CREATE ORDER =================
// =================================================

exports.createOrder = async (req, res) => {

  console.log("🚀 CREATE ORDER START");

  try {

    const userId = req.user?.id;
    const { items, totalAmount, address } = req.body;

    console.log("👤 USER:", userId);
    console.log("📦 ITEMS:", items?.length);
    console.log("💰 TOTAL:", totalAmount);

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Order items required" });
    }

    if (!totalAmount) {
      return res.status(400).json({ error: "Total amount required" });
    }

    if (!address) {
      return res.status(400).json({ error: "Delivery address required" });
    }

    // ================================
    // 1️⃣ CREATE ORDER
    // ================================

    console.log("👉 INSERT ORDER");

    const result = await db.query(
      "INSERT INTO orders (user_id, total_amount, status, payment_status) VALUES (?, ?, 'PENDING', 'PENDING')",
      [userId, totalAmount]
    );

    const orderId = result.insertId;

    console.log("✅ ORDER CREATED:", orderId);

    // ================================
    // 2️⃣ INSERT ITEMS
    // ================================

   console.log("👉 INSERT ITEMS");

const orderItems = items.map(item => [
  orderId,
  item.product_id,
  item.quantity,
  item.price
]);

await db.pool.query(
  `INSERT INTO order_items 
   (order_id, product_id, quantity, price)
   VALUES ?`,
  [orderItems]
);

console.log("✅ ITEMS INSERTED");

    // ================================
    // 3️⃣ INSERT ADDRESS
    // ================================

    console.log("👉 INSERT ADDRESS");

    await db.query(
      `INSERT INTO order_address
      (order_id, full_name, phone, address_line1, address_line2, city, state, pincode, country)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderId,
        address.full_name,
        address.phone,
        address.address_line1,
        address.address_line2 || "",
        address.city,
        address.state,
        address.pincode,
        address.country || "India"
      ]
    );

    console.log("🎉 ORDER COMPLETE");

    return res.status(201).json({
      success: true,
      orderId
    });

  } catch (err) {
    console.error("❌ CREATE ORDER ERROR:", err.message);
    return res.status(500).json({ error: "Order failed" });
  }
};


// =================================================
// ========== GET LOGGED-IN USER ORDERS ============
// =================================================

exports.getOrdersByUser = async (req, res) => {

  try {

    const userId = req.user?.id;

    if (!userId) {
      return res.json([]);
    }

    const results = await db.query(
      `SELECT id, total_amount, status, payment_status, created_at
       FROM orders
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json(results);

  } catch (err) {
    console.error("❌ Fetch user orders error:", err.message);
    return res.status(500).json({ error: "Database error" });
  }
};


// =================================================
// ============== GET ORDER DETAILS ================
// =================================================

exports.getOrderDetails = async (req, res) => {

  try {

    const orderId = req.params.id;

    const items = await db.query(
      "SELECT * FROM order_items WHERE order_id = ?",
      [orderId]
    );

    const address = await db.query(
      "SELECT * FROM order_address WHERE order_id = ?",
      [orderId]
    );

    res.json({
      items,
      address: address[0] || null
    });

  } catch (err) {
    console.error("❌ Fetch order details error:", err.message);
    return res.status(500).json({ error: "Database error" });
  }
};


// =================================================
// ============== ADMIN — GET ALL ORDERS ===========
// =================================================

exports.getAllOrders = async (req, res) => {

  try {

    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        error: "Admin access only"
      });
    }

    const results = await db.query(
      `SELECT id, user_id, total_amount, status, payment_status, created_at
       FROM orders
       ORDER BY created_at DESC`
    );

    res.json(results);

  } catch (err) {
    console.error("❌ Fetch all orders error:", err.message);
    return res.status(500).json({ error: "Database error" });
  }
};


// =================================================
// ========= UPDATE PAYMENT STATUS (WORKER) ========
// =================================================

exports.updatePaymentStatus = async (req, res) => {

  try {

    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({
        error: "orderId and status required"
      });
    }

    await db.query(
      "UPDATE orders SET payment_status = ? WHERE id = ?",
      [status, orderId]
    );

    res.json({
      success: true,
      message: "Order payment updated"
    });

  } catch (err) {
    console.error("❌ Payment update error:", err.message);
    return res.status(500).json({ error: "Update failed" });
  }
};
// =================================================
// ========= UPDATE ORDER STATUS (WORKER) ========
// =================================================
exports.updateOrderStatus = async (req, res) => {
  try {

    const { orderId, status, paymentId } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({
        error: "orderId and status required"
      });
    }

    await db.query(
      `UPDATE orders 
       SET status = ?, payment_status = 'PAID', payment_id = ?
       WHERE id = ?`,
      [status, paymentId || null, orderId]
    );

    res.json({
      success: true,
      message: "Order status updated"
    });

  } catch (err) {
    console.error("❌ Order status update error:", err.message);
    return res.status(500).json({ error: "Update failed" });
  }
};
