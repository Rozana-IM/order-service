const db = require("../db");

// =================================================
// ================= CREATE ORDER =================
// =================================================

exports.createOrder = async (req, res) => {
  try {
    const userId = req.user?.id;
    let { items, totalAmount, address } = req.body;

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

    const result = await db.query(
      "INSERT INTO orders (user_id, total_amount, status, payment_status) VALUES (?, ?, 'PLACED', 'PENDING')",
      [userId, totalAmount]
    );

    const orderId = result.insertId;

    // ================================
    // 2️⃣ INSERT ITEMS
    // ================================

    const orderItems = items.map(item => [
      orderId,
      Number(item.product_id),
      Number(item.quantity),
      Number(item.price),
      item.product_name || "Product",
      item.image_url || ""
    ]);

    await db.pool.query(`
      INSERT INTO order_items 
      (order_id, product_id, quantity, price, product_name, image_url)
      VALUES ?
    `, [orderItems]);

    // ================================
    // 3️⃣ HANDLE ADDRESS
    // ================================

    if (address.addressId) {
      const addr = await db.query(
        "SELECT * FROM user_addresses WHERE id = ?",
        [address.addressId]
      );

      if (!addr || addr.length === 0) {
        return res.status(400).json({ error: "Invalid address selected" });
      }

      address = addr[0];
    }

    // ================================
    // INSERT ADDRESS
    // ================================

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

    return res.status(201).json({
      success: true,
      orderId
    });

  } catch (err) {
    console.error("❌ CREATE ORDER ERROR:", err);
    return res.status(500).json({ error: "Order failed" });
  }
};
