const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const rateLimit = require("express-rate-limit");
const session = require("express-session");

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Body parser middleware
app.use(express.json());

// Define a rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

app.use(limiter);

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true, httpOnly: true, maxAge: 60000 },
  })
);

// API routes
app.use("/api", authRoutes);

module.exports = app;
