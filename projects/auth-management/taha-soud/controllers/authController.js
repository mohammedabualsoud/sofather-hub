const User = require("../models/user.js");

// Register a new user
const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    const user = await User.create({ userName, email, password });

    // Remove the password from the response
    user.password = undefined;

    console.log("User created successfully:", user);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    console.error("Error during user creation:", error.message);
    res.status(400).json({ success: false, error: error.message });
  }
};

// Login a user
const loginUser = async (req, res) => {
  const { userName, password } = req.body;
  try {
    const user = await User.findOne({ userName });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid Credentials" });
    }

    // Check if the provided password matches the stored hashed password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid Credentials" });
    }

    // Ensure password is not exposed in the response
    user.password = undefined;

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
