const Appointment = require("../models/appointmentModel");
const Doctor = require("../models/doctorModel");
const User = require("../models/userModel");

// Book appointment
const bookAppointmentController = async (req, res) => {
  try {
    const { doctorId, date, time } = req.body;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).send({ success: false, message: "Doctor not found" });
    }

    const user = await User.findById(req.body.userId).select("-password");
    if (!user) {
      return res.status(404).send({ success: false, message: "User not found" });
    }

    const appointment = new Appointment({
      userId: req.body.userId,
      doctorId,
      doctorInfo: doctor,
      userInfo: user,
      date,
      time,
      status: "pending",
    });

    await appointment.save();

    res.status(201).send({ success: true, message: "Appointment booked successfully!" });
  } catch (error) {
    res.status(500).send({ success: false, message: `Error: ${error.message}` });
  }
};

// Get user appointments
const getUserAppointmentsController = async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.body.userId }).sort({ createdAt: -1 });
    res.status(200).send({ success: true, data: appointments });
  } catch (error) {
    res.status(500).send({ success: false, message: `Error: ${error.message}` });
  }
};

module.exports = { bookAppointmentController, getUserAppointmentsController };
