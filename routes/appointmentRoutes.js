const express = require("express");
const { bookAppointmentController, getUserAppointmentsController } = require("../controllers/appointmentCtrl");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// POST /api/v1/appointment/book
router.post("/book", authMiddleware, bookAppointmentController);

// GET /api/v1/appointment/my-appointments
router.get("/my-appointments", authMiddleware, getUserAppointmentsController);

module.exports = router;
