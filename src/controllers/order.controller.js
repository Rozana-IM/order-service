const db = require("../db");

// =================================================
// ================= CREATE ORDER =================
// =================================================

exports.createOrder = (req, res) => {

  const userId = req.user.id;
  const { items, totalAmount } = req.body;

  if (!items || !totalAmount) {
    return res.status(400).json({
      error: "Items and totalAmount required",
    });
  }

  db.pool.query(
    "INSERT INTO orders (user_id, items, total_amount) VALUES (?, ?, ?)",
    [userId, JSON.stringify(items), totalAmount],
    (err, result) => {

      if (err) {
        console.error("❌ Create order error:", err.message);
        return res.status(500).json({ error: "Database error" });
      }

      res.status(201).json({
        order: {
          id: result.insertId,
          userId,
          items,
          totalAmount,
        },
      });
    }
  );
};


// =================================================
// ========== GET LOGGED-IN USER ORDERS ============
// =================================================

exports.getOrdersByUser = (req, res) => {

  const userId = req.user.id;

  db.pool.query(
    "SELECT * FROM orders WHERE user_id = ?",
    [userId],
    (err, results) => {

      if (err) {
        console.error("❌ Fetch user orders error:", err.message);
        return res.status(500).json({ error: "Database error" });
      }

      const orders = results.map(order => ({
        id: order.id,
        userId: order.user_id,
        items: JSON.parse(order.items),
        totalAmount: order.total_amount,
        createdAt: order.created_at,
      }));

      res.json(orders);
    }
  );
};


// =================================================
// ============== ADMIN — GET ALL ORDERS ===========
// =================================================

exports.getAllOrders = (req, res) => {

  // ✅ ADMIN CHECK (NEW — IMPORTANT)
  if (req.user.role !== "admin") {
    return res.status(403).json({
      error: "Admin access only",
    });
  }

  db.pool.query(
    "SELECT * FROM orders",
    (err, results) => {

      if (err) {
        console.error("❌ Fetch all orders error:", err.message);
        return res.status(500).json({ error: "Database error" });
      }

      const orders = results.map(order => ({
        id: order.id,
        userId: order.user_id,
        items: JSON.parse(order.items),
        totalAmount: order.total_amount,
        createdAt: order.created_at,
      }));

      res.json(orders);
    }
  );
};
