const express = require("express");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const rateLimit = require("express-rate-limit");
const session = require("express-session");

dotenv.config();

const app = express();

app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
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

app.use("/api", authRoutes);

module.exports = app;
