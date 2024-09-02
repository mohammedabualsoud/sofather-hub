const User = require("../models/user");

const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    const user = await User.create({ userName, email, password });
    console.log("User created successfully:", user);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    console.error("Error during user creation:", error.message);
    res.status(400).json({ success: false, error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { userName, password } = req.body;
  try {
    const user = await User.findOne({ userName });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid Credentials" });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid Credentials" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
