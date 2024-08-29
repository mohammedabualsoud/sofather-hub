// Import required modules
const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const { basicAuth } = require("../middlewares/authMiddleware");
const User = require("../models/user");

// Create a router instance
const router = express.Router();

// Define public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Define a protected route accessible to authenticated users
router.get("/protected", basicAuth, (req, res) => {
  res.status(200).json({
    message: `Welcome ${req.user.userName}, you have accessed a protected route!`,
  });
});

// Define a role-based protected route accessible to admins only
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

// Define a role-based protected route accessible to users only
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

// Define a route to retrieve a user by their userName
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
// Define a route to retrieve an admin by their userName

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

// Export the router
module.exports = router;
