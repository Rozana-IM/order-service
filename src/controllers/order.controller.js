const db = require("../db");

// ================= CREATE ORDER =================
exports.createOrder = (req, res) => {
  const { userId, items, totalAmount } = req.body;

  if (!userId || !items || !totalAmount) {
    return res.status(400).json({ error: "All fields are required" });
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

// ================= GET USER ORDERS =================
exports.getOrdersByUser = (req, res) => {
  const { userId } = req.params;

  db.pool.query(
    "SELECT * FROM orders WHERE user_id = ?",
    [userId],
    (err, results) => {
      if (err) {
        console.error("❌ Fetch user orders error:", err.message);
        return res.status(500).json({ error: "Database error" });
      }

      const orders = results.map((order) => ({
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

// ================= ADMIN – GET ALL ORDERS =================
exports.getAllOrders = (req, res) => {
  db.pool.query("SELECT * FROM orders", (err, results) => {
    if (err) {
      console.error("❌ Fetch all orders error:", err.message);
      return res.status(500).json({ error: "Database error" });
    }

    const orders = results.map((order) => ({
      id: order.id,
      userId: order.user_id,
      items: JSON.parse(order.items),
      totalAmount: order.total_amount,
      createdAt: order.created_at,
    }));

    res.json(orders);
  });
};
