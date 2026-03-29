const express = require("express");
const { loginController, registerController, getUserController } = require("../controllers/userCtrl");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// POST /api/v1/user/register
router.post("/register", registerController);

// POST /api/v1/user/login
router.post("/login", loginController);

// GET /api/v1/user/profile  (protected)
router.get("/profile", authMiddleware, getUserController);

module.exports = router;
