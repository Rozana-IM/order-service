const jwt = require("jsonwebtoken");

/* =====================================
   VERIFY USER TOKEN
===================================== */

exports.verifyToken = (req, res, next) => {

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Token required"
    });
  }

  const token = authHeader.split(" ")[1];

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

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

  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      error: "Admin access required"
    });
  }

  next();
};
