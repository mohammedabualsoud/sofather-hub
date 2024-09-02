const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const { basicAuth } = require("../middlewares/authMiddleware");
const User = require("../models/user");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/protected", basicAuth, (req, res) => {
  res.status(200).json({
    message: `Welcome ${req.user.userName}, you have accessed a protected route!`,
  });
});

router.get("/admin", basicAuth, (req, res) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ success: false, message: "Access denied. Admins only." });
  }
  res
    .status(200)
    .json({ success: true, message: `Welcome admin ${req.user.userName}!` });
});

router.get("/user", basicAuth, (req, res) => {
  if (req.user.role !== "user") {
    return res
      .status(403)
      .json({ success: false, message: "Access denied. Users only." });
  }
  res
    .status(200)
    .json({ success: true, message: `Welcome user ${req.user.userName}!` });
});

router.get("/user/:userName", async (req, res) => {
  try {
    const user = await User.findOne({ userName: req.params.userName });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get("/admin/:userName", async (req, res) => {
  try {
    const user = await User.findOne({ userName: req.params.userName });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
