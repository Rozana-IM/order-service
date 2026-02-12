const mysql = require("mysql2");

// Create connection pool (recommended for production)
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test DB connection
const connect = () => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("❌ Database connection failed:", err.message);
      return;
    }

    console.log("✅ Order Service DB connected");
    connection.release();
  });
};

module.exports = {
  pool,
  connect,
};
