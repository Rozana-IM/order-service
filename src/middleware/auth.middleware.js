const jwt = require("jsonwebtoken");

/* =====================================
   SERVICE TOKEN (FOR MICROSERVICES)
===================================== */
const SERVICE_TOKEN = process.env.SERVICE_TOKEN;

/* =====================================
   VERIFY USER / SERVICE TOKEN
===================================== */

exports.verifyToken = (req, res, next) => {

  console.log("🚨 VERIFY TOKEN HIT:", req.method, req.originalUrl);

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("❌ No token provided");
    return res.status(401).json({
      error: "Token required"
    });
  }

  const token = authHeader.split(" ")[1];

  /* ===============================
     ✅ SERVICE-TO-SERVICE ACCESS
  =============================== */
  if (token === SERVICE_TOKEN) {
    console.log("🤖 Service token accepted");

    req.user = {
      role: "service"
    };

    return next();
  }

  /* ===============================
     ✅ NORMAL USER JWT VERIFY
  =============================== */
  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    console.log("✅ Token verified:", decoded);

    next();

  } catch (err) {

    console.error("❌ Token verification failed:", err.message);

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Token expired"
      });
    }

    return res.status(401).json({
      error: "Invalid token"
    });
  }
};


/* =====================================
   ADMIN AUTHORIZATION
===================================== */

exports.verifyAdmin = (req, res, next) => {

  console.log("🔐 ADMIN CHECK");

  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      error: "Admin access required"
    });
  }

  next();
};
