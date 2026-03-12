const express = require("express");
const cors = require("cors");

// ... your other requires ...

const app = express();
const PORT = process.env.PORT || 5000;  

// SAME CORS for both services
const allowedOrigins = [
  "https://rozana-projects.online",
  "https://d1u1ckd80xkseo.cloudfront.net",
  "http://localhost:3000"  // Add for local dev
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204
}));

app.use(express.json());

// ... rest of your code (db.connect(), routes, health checks) ...
