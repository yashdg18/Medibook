const User = require("../models/userModel");
const Doctor = require("../models/doctorModel");
const Appointment = require("../models/appointmentModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register
const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check existing user
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(200).send({ message: "User already exists", success: false });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).send({ message: "Registered successfully!", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: `Register error: ${error.message}` });
  }
};

// Login
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).send({ message: "User not found", success: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(200).send({ message: "Invalid email or password", success: false });
    }

    // Sign token with id AND role so frontend/backend knows who this is
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(200).send({ message: "Login successful", success: true, token });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: `Login error: ${error.message}` });
  }
};

// Get user profile
const getUserController = async (req, res) => {
  try {
    const user = await User.findById(req.body.userId).select("-password");
    if (!user) {
      return res.status(404).send({ success: false, message: "User not found" });
    }
    res.status(200).send({ success: true, data: user });
  } catch (error) {
    res.status(500).send({ success: false, message: `Get user error: ${error.message}` });
  }
};

module.exports = { loginController, registerController, getUserController };
