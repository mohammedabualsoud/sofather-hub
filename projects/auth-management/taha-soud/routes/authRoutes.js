const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController.js");
const { basicAuth } = require("../middlewares/authMiddleware.js");
const { isAdmin, isUser } = require("../middlewares/roleMiddleware.js");
const User = require("../models/user");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", basicAuth, loginUser);

router.get("/protected", basicAuth, (req, res) => {
  res.status(200).json({
    message: `Welcome ${req.user.userName}, you have accessed a protected route!`,
  });
});

router.get("/admin", basicAuth, isAdmin, (req, res) => {
  res.status(200).json({
    success: true,
    message: `Welcome admin ${req.user.userName}!`,
  });
});

router.get("/admin/:userName", basicAuth, isAdmin, async (req, res) => {
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

router.get("/user", basicAuth, isUser, (req, res) => {
  res.status(200).json({
    success: true,
    message: `Welcome user ${req.user.userName}!`,
  });
});

module.exports = router;
