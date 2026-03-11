const mysql = require("mysql2/promise");

/*
=========================================
Create MySQL Connection Pool
=========================================
*/

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  /* Recommended settings */
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});


/*
=========================================
Test Database Connection
=========================================
*/

async function connect() {
  try {

    const connection = await pool.getConnection();

    console.log("✅ Order Service DB connected");

    connection.release();

  } catch (err) {

    console.error("❌ Order Service DB connection failed:", err.message);

    process.exit(1); // crash container if DB unavailable
  }
}


/*
=========================================
Helper Query Function
=========================================
*/

async function query(sql, params) {

  try {

    const [rows] = await pool.execute(sql, params);

    return rows;

  } catch (err) {

    console.error("❌ Database query error:", err.message);

    throw err;
  }
}


/*
=========================================
Exports
=========================================
*/

module.exports = {
  pool,
  connect,
  query
};
