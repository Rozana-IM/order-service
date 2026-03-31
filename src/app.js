const express = require("express");
const cors = require("cors");
const { connect } = require("./db");

const app = express();

connect().catch(err => console.error("DB Error:", err));

app.use(express.json());

/* ✅ CORS (KEEP THIS) */
app.use(cors({
  origin: [
    "https://rozana-projects.online",
    "https://www.rozana-projects.online",
    "https://d1u1ckd80xkseo.cloudfront.net"
  ],
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: true
}));

app.options("*", cors());

/* ✅ ADD THIS HERE (VERY IMPORTANT) */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

/* ✅ HEALTH ROUTES */
app.get("/orders/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP" });
});

/* ✅ LOAD ROUTES */
const orderRoutes = require("./routes/order.routes");

/* ✅ KEEP ONLY THIS (IMPORTANT) */
app.use("/orders", orderRoutes);

/* ❌ REMOVE THIS LINE (CAUSES BUGS) */
/* app.use("/orders/", orderRoutes); */

app.listen(5000, "0.0.0.0", () => {
  console.log("✅ Order service LIVE");
});
