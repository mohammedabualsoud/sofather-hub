const jwt = require("jsonwebtoken");
const User = require("../models/user.js");
const blacklistedTokens = new Set();

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, userName: user.userName, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
};

const logOut = async (req, res) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  blacklistedTokens.add(token);
  res.status(200).json({ success: true, message: "Logged out successfully." });
};

const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;

  if (!userName || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields (username, email, password) are required.",
    });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ userName }, { email }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this username or email already exists.",
      });
    }

    const user = await User.create({ userName, email, password });
    user.password = undefined;

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      data: {
        token,
        user: { userName: user.userName, email: user.email, role: user.role },
      },
    });
  } catch (error) {
    console.error("Error during user creation:", error.message);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "User validation failed",
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal Server Error: Please try again later.",
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  const { userName, password } = req.body;
  try {
    const user = await User.findOne({ userName });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid userName" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid Password" });
    }

    user.password = undefined;

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      data: {
        token,
        user: { userName: user.userName, email: user.email, role: user.role },
      },
    });
  } catch (error) {
    console.error("Error during login:", error.message);

    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logOut,
  blacklistedTokens,
};
