const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const UserModel = require("../models/UserModel");

const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res
        .status(400)
        .json({ message: "fullName, email and password are required" });
    }

    const existing = await UserModel.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hash = await bcrypt.hash(password, 10);
    await UserModel.create({ fullName, email, password: hash });

    return res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    console.error("register error:", err.message);
    return res
      .status(400)
      .json({ message: err.message || "Registration failed" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: "Login failed" });
    }

    const userId = user._id.toString();
    const userName = user.fullName; // ← было user.name (undefined)

    const token = jwt.sign({ userId, userName }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res
      .status(200)
      .json({ message: "Login successful", token, userName, userId });
  } catch (err) {
    console.error("login error:", err.message);
    return res.status(500).json({ message: err.message || "Login error" });
  }
};

module.exports = { register, login };