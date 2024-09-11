const User = require("../models/user.js");

const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;

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

    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      data: {
        userName: user.userName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error during user creation:", error.message);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error: Please check your input.",
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
  try {
    const user = req.user;

    res.status(200).json({
      success: true,
      message: "Login successful.",
      data: {
        userName: user.userName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error: Please try again later.",
      error: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
