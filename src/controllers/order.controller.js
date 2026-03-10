const db = require("../db");

// ======================================
// CREATE ORDER
// ======================================

exports.createOrder = (req, res) => {

  const userId = req.user.id;
  const { items, totalAmount, address } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: "Order items required" });
  }

  if (!address) {
    return res.status(400).json({ error: "Address required" });
  }

  // 1️⃣ Insert order
  db.pool.query(
    "INSERT INTO orders (user_id, total_amount) VALUES (?, ?)",
    [userId, totalAmount],
    (err, orderResult) => {

      if (err) {
        console.error("❌ Order creation failed:", err.message);
        return res.status(500).json({ error: "Database error" });
      }

      const orderId = orderResult.insertId;

      // 2️⃣ Insert order items
      const itemsValues = items.map(item => [
        orderId,
        item.product_id,
        item.product_name,
        item.price,
        item.quantity,
        item.image_url
      ]);

      db.pool.query(
        "INSERT INTO order_items (order_id, product_id, product_name, price, quantity, image_url) VALUES ?",
        [itemsValues],
        (err) => {

          if (err) {
            console.error("❌ Order items error:", err.message);
            return res.status(500).json({ error: "Items insert failed" });
          }

          // 3️⃣ Insert address
          db.pool.query(
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
            ],
            (err) => {

              if (err) {
                console.error("❌ Address insert error:", err.message);
                return res.status(500).json({ error: "Address insert failed" });
              }

              res.status(201).json({
                message: "Order created successfully",
                orderId: orderId
              });

            }
          );

        }
      );

    }
  );

};
