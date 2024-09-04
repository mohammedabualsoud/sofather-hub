const User = require("../models/user.js");

const basicAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return res.status(401).json({
      message: "Authorization header missing or malformed",
    });
  }

  try {
    const base64Credentials = authHeader.split(" ")[1];
    const credentials = Buffer.from(base64Credentials, "base64").toString(
      "ascii"
    );
    const [userName, password] = credentials.split(":");

    const user = await User.findOne({ userName });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in basicAuth middleware:", error.message);
    res.status(500).json({
      message: "Internal server error during authentication",
    });
  }
};

module.exports = { basicAuth };
