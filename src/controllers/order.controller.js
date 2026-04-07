const db = require("../db");

/* =================================================
   ================= CREATE ORDER =================
================================================= */
exports.createOrder = async (req, res) => {
  const connection = await db.pool.getConnection(); // ✅ STEP 1

  try {
    const userId = req.user?.id;
    let { items, totalAmount, address } = req.body;

    console.log("📦 ITEMS:", items);
    console.log("📍 ADDRESS:", address);

    // ✅ VALIDATIONS (KEEP OUTSIDE TRANSACTION)
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Order items required" });
    }

    if (!totalAmount) {
      return res.status(400).json({ error: "Total amount required" });
    }

    if (!address) {
      return res.status(400).json({ error: "Delivery address required" });
    }

    // ✅ ITEM VALIDATION (NEW FIX)
    if (!items.every(item => item.product_id && item.quantity && item.price)) {
      return res.status(400).json({ error: "Invalid item data" });
    }

    await connection.beginTransaction(); // ✅ STEP 2

    /* ================================
       1️⃣ CREATE ORDER
    ================================= */
    const [result] = await connection.query(
      `INSERT INTO orders 
       (user_id, total_amount, status, payment_status) 
       VALUES (?, ?, 'PLACED', 'PENDING')`,
      [userId, totalAmount]
    );

    const orderId = result.insertId;
    console.log("✅ ORDER CREATED:", orderId);

    /* ================================
       2️⃣ INSERT ITEMS
    ================================= */
    const orderItems = items.map(item => [
      orderId,
      Number(item.product_id),
      Number(item.quantity),
      Number(item.price),
      item.product_name || "Product",
      item.image_url || ""
    ]);

    await connection.query(
      `INSERT INTO order_items 
       (order_id, product_id, quantity, price, product_name, image_url)
       VALUES ?`,
      [orderItems]
    );

    console.log("✅ ITEMS INSERTED");

    /* ================================
       3️⃣ HANDLE ADDRESS
    ================================= */

    if (!address.full_name) {
  throw new Error("Address data missing");
}

    if (
      !address.full_name ||
      !address.phone ||
      !address.address_line1 ||
      !address.city ||
      !address.state ||
      !address.pincode
    ) {
      throw new Error("Incomplete address data"); // ❗ rollback trigger
    }

    /* ================================
       4️⃣ INSERT ADDRESS
    ================================= */
    console.log("ADDRESS:", address);
     address.address_line2 = address.address_line2 || "";
     
     await connection.query(
      `INSERT INTO order_address
(order_id, full_name, phone, address_line1, address_line2, city, state, pincode, country)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderId,
        address.full_name || null,
        address.phone || null,
        address.address_line1 || null,
        address.address_line2 || null,
        address.city || null,
        address.state || null,
        address.pincode || null,
        address.country || "India"
      ]
    );

    console.log("🎉 ORDER COMPLETE");

    await connection.commit(); // ✅ STEP 3

    return res.status(201).json({
      success: true,
      orderId
    });

  } catch (err) {
    await connection.rollback(); // ❌ STEP 4 (VERY IMPORTANT)
    console.error("❌ CREATE ORDER ERROR:", err.message);

    return res.status(500).json({ error: err.message || "Order failed" });

  } finally {
    connection.release(); // ✅ STEP 5
  }
};
/* =================================================
   ========== GET LOGGED-IN USER ORDERS ============
================================================= */
exports.getOrdersByUser = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) return res.json([]);

    const results = await db.query(`
      SELECT 
        o.id,
        o.total_amount,
        o.status,
        o.payment_status,
        o.created_at,
        MIN(oi.quantity) AS quantity,
        MIN(oi.product_name) AS product_name,
        MIN(oi.image_url) AS image_url
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = ?
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `, [userId]);

    res.json(results);

  } catch (err) {
    console.error("❌ Fetch orders error:", err);
    res.status(500).json({ error: "Database error" });
  }
};

/* =================================================
   ============== GET ORDER DETAILS ================
================================================= */
exports.getOrderDetails = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user?.id;

    const order = await db.query(
      `SELECT * FROM orders WHERE id = ? AND user_id = ?`,
      [orderId, userId]
    );

    if (!order || order.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const items = await db.query(
      `SELECT * FROM order_items WHERE order_id = ?`,
      [orderId]
    );

    const address = await db.query(
      `SELECT * FROM order_address WHERE order_id = ?`,
      [orderId]
    );

    res.json({
      ...order[0],
      items,
      address: address[0] || null
    });

  } catch (err) {
    console.error("❌ Order details error:", err);
    res.status(500).json({ error: "Database error" });
  }
};

/* =================================================
   ============== UPDATE ORDER STATUS ==============
================================================= */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status, paymentId } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({ error: "Missing data" });
    }

    let paymentStatus = "PENDING";

    if (["PAID", "SUCCESS", "COMPLETED"].includes(status)) {
      paymentStatus = "PAID";
    } else if (status === "FAILED") {
      paymentStatus = "FAILED";
    }

    await db.query(
      `UPDATE orders 
       SET status = ?, payment_status = ?, payment_id = ?
       WHERE id = ?`,
      [status, paymentStatus, paymentId || null, orderId]
    );

    res.json({ success: true });

  } catch (err) {
    console.error("❌ Update order error:", err);
    res.status(500).json({ error: "Update failed" });
  }
};


exports.getAllOrders = async (req, res) => {
  try {
    const orders = await db.query(`
      SELECT * FROM orders ORDER BY created_at DESC
    `);

    res.json(orders);

  } catch (err) {
    console.error("❌ Fetch all orders error:", err);
    res.status(500).json({ error: "Database error" });
  }
};
