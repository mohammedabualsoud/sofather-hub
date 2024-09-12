const express = require("express");
const {
  registerUser,
  loginUser,
  logOut,
} = require("../controllers/authController.js");
const { verifyToken } = require("../middlewares/jwtMiddleware.js");
const { isAdmin, isUser } = require("../middlewares/roleMiddleware.js");
const User = require("../models/user");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/protected", verifyToken, (req, res) => {
  res.status(200).json({
    message: `Welcome ${req.user.userName}, you have accessed a protected route!`,
  });
});

router.post("/logout", verifyToken, logOut);

router.get("/admin", verifyToken, isAdmin, (req, res) => {
  res.status(200).json({
    success: true,
    message: `Welcome admin ${req.user.userName}!`,
  });
});

router.get("/admin/:userName", verifyToken, isAdmin, async (req, res) => {
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

router.get("/user", verifyToken, isUser, (req, res) => {
  res.status(200).json({
    success: true,
    message: `Welcome user ${req.user.userName}!`,
  });
});

module.exports = router;
