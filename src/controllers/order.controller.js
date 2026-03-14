const db = require("../db");

// =================================================
// ================= CREATE ORDER =================
// =================================================

exports.createOrder = (req, res) => {

const userId = 1; // temporary test user
  const { items, totalAmount, address } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({
      error: "Order items required",
    });
  }

  if (!totalAmount) {
    return res.status(400).json({
      error: "Total amount required",
    });
  }

  if (!address) {
    return res.status(400).json({
      error: "Delivery address required",
    });
  }

  // ================================
  // 1️⃣ CREATE ORDER
  // ================================

  const createOrderQuery =
    "INSERT INTO orders (user_id, total_amount, status, payment_status) VALUES (?, ?, 'pending', 'pending')";

  db.pool.query(
    createOrderQuery,
    [userId, totalAmount],
    (err, orderResult) => {

      if (err) {
        console.error("❌ Create order error:", err.message);
        return res.status(500).json({ error: "Database error" });
      }

      const orderId = orderResult.insertId;

      // ================================
      // 2️⃣ INSERT ORDER ITEMS
      // ================================

      const orderItems = items.map(item => [
        orderId,
        item.product_id,
        item.product_name,
        item.price,
        item.quantity,
        item.image_url
      ]);

      const insertItemsQuery = `
        INSERT INTO order_items
        (order_id, product_id, product_name, price, quantity, image_url)
        VALUES ?
      `;

      db.pool.query(insertItemsQuery, [orderItems], (err) => {

        if (err) {
          console.error("❌ Insert order items error:", err.message);
          return res.status(500).json({ error: "Order items insert failed" });
        }

        // ================================
        // 3️⃣ INSERT ADDRESS
        // ================================

        const addressQuery = `
          INSERT INTO order_address
          (order_id, full_name, phone, address_line1, address_line2, city, state, pincode, country)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.pool.query(
          addressQuery,
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
              console.error("❌ Insert address error:", err.message);
              return res.status(500).json({ error: "Address insert failed" });
            }

            // ================================
            // 4️⃣ SUCCESS RESPONSE
            // ================================

            res.status(201).json({
              success: true,
              message: "Order created successfully",
              orderId: orderId
            });

          }
        );

      });

    }
  );

};


// =================================================
// ========== GET LOGGED-IN USER ORDERS ============
// =================================================

exports.getOrdersByUser = (req, res) => {

  const userId = req.user?.id;

  if(!userId){
    return res.json([]); // or return 401
  }

  const query = `
    SELECT id, total_amount, status, payment_status, created_at
    FROM orders
    WHERE user_id = ?
    ORDER BY created_at DESC
  `;

  db.pool.query(query, [userId], (err, results) => {

    if (err) {
      console.error("❌ Fetch user orders error:", err.message);
      return res.status(500).json({ error: "Database error" });
    }

    res.json(results);

  });

};


// =================================================
// ============== GET ORDER DETAILS ================
// =================================================

exports.getOrderDetails = (req, res) => {

  const orderId = req.params.id;

  db.pool.query(
    "SELECT * FROM order_items WHERE order_id = ?",
    [orderId],
    (err, items) => {

      if (err) {
        console.error("❌ Fetch order items error:", err.message);
        return res.status(500).json({ error: "Database error" });
      }

      db.pool.query(
        "SELECT * FROM order_address WHERE order_id = ?",
        [orderId],
        (err, address) => {

          if (err) {
            console.error("❌ Fetch address error:", err.message);
            return res.status(500).json({ error: "Database error" });
          }

          res.json({
            items,
            address: address[0] || null
          });

        }
      );

    }
  );

};


// =================================================
// ============== ADMIN — GET ALL ORDERS ===========
// =================================================

exports.getAllOrders = (req, res) => {

if (!req.user || req.user.role !== "admin") {
  return res.status(403).json({
      error: "Admin access only"
    });
  }

  const query = `
    SELECT id, user_id, total_amount, status, payment_status, created_at
    FROM orders
    ORDER BY created_at DESC
  `;

  db.pool.query(query, (err, results) => {

    if (err) {
      console.error("❌ Fetch all orders error:", err.message);
      return res.status(500).json({ error: "Database error" });
    }

    res.json(results);

  });

};


// =================================================
// ========= UPDATE PAYMENT STATUS (WORKER) ========
// =================================================

exports.updatePaymentStatus = (req, res) => {

  const { orderId, status } = req.body;

  if (!orderId || !status) {
    return res.status(400).json({
      error: "orderId and status required"
    });
  }

  db.pool.query(
    "UPDATE orders SET payment_status = ? WHERE id = ?",
    [status, orderId],
    (err) => {

      if (err) {
        console.error("❌ Payment update error:", err.message);
        return res.status(500).json({ error: "Update failed" });
      }

      res.json({
        success: true,
        message: "Order payment updated"
      });

    }
  );

};
