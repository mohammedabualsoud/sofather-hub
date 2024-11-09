
import userService from "../services/userService.js";

export const signup = async (req, res) => {
  const {username, password , email, role } = req.body;

  try {
    await userService.registerUser(username, password, email, role);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    if (error.message === "User already exists") {
      res.status(400).json({ error: "User already exists" });
  } else {
      res.status(500).json({ error: "Registration failed", details: error.message });
  }  }
};

export const login = async (req, res) => {
  try {
    res.status(200).json({ message: "User logged in successfully", user: req.user });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

export const allUsers = async (req, res) => {
  try {
    res.status(200).json({ users: users });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

