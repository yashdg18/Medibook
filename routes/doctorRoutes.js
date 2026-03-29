const express = require("express");
const {
  doctorRegisterController,
  getDoctorProfileController,
  doctorDashboardController,
  getDoctorAppointmentsController,
  updateAppointmentStatusController,
  getAllDoctorsController,
  getDoctorByIdController,
} = require("../controllers/doctorCtrl");

const authMiddleware   = require("../middleware/authMiddleware");
const doctorMiddleware = require("../middleware/doctorMiddleware");

const router = express.Router();

// ── Public ───────────────────────────────────────────
router.post("/register", doctorRegisterController);

// ── Doctor protected routes (MUST come before /:doctorId) ──
// BUG FIX: specific routes must be registered before /:doctorId
// otherwise Express matches /doctor-info as the :doctorId param
router.get("/doctor-info/profile",      doctorMiddleware, getDoctorProfileController);
router.get("/doctor-info/dashboard",    doctorMiddleware, doctorDashboardController);
router.get("/doctor-info/appointments", doctorMiddleware, getDoctorAppointmentsController);
router.post("/doctor-info/update-status", doctorMiddleware, updateAppointmentStatusController);

// ── Patient side ─────────────────────────────────────
router.get("/all", authMiddleware, getAllDoctorsController);

// ── This MUST be last — catches any /:doctorId ───────
router.get("/:doctorId", authMiddleware, getDoctorByIdController);

module.exports = router;
