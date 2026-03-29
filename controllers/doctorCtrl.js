const Doctor      = require("../models/doctorModel");
const User        = require("../models/userModel");
const Appointment = require("../models/appointmentModel");
const bcrypt      = require("bcryptjs");
const jwt         = require("jsonwebtoken");

const doctorRegisterController = async (req, res) => {
  try {
    const {
      name, email, password,
      phone, address, specialization,
      experience, feesPerConsultation,
      timingStart, timingEnd, website,
    } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(200).send({ message: "Email already registered", success: false });
    }

    const salt           = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hashedPassword, role: "doctor" });
    await newUser.save();

    const newDoctor = new Doctor({
      userId:              newUser._id.toString(),
      firstName:           name.split(" ")[0],
      lastName:            name.split(" ").slice(1).join(" ") || ".",
      phone, email,
      website:             website || "",
      address, specialization, experience,
      feesPerConsultation: Number(feesPerConsultation),
      timings:             { start: timingStart, end: timingEnd },
      status:              "approved",
    });
    await newDoctor.save();

    res.status(201).send({ message: "Doctor registered successfully!", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: `Register error: ${error.message}` });
  }
};

const getDoctorProfileController = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.body.userId });
    if (!doctor) return res.status(404).send({ success: false, message: "Doctor profile not found" });
    res.status(200).send({ success: true, data: doctor });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

const doctorDashboardController = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.body.userId });
    if (!doctor) return res.status(404).send({ success: false, message: "Doctor not found" });

    const appointments = await Appointment.find({ doctorId: doctor._id.toString() }).sort({ createdAt: -1 });

    const stats = {
      total:    appointments.length,
      pending:  appointments.filter((a) => a.status === "pending").length,
      approved: appointments.filter((a) => a.status === "approved").length,
      rejected: appointments.filter((a) => a.status === "rejected").length,
    };

    res.status(200).send({ success: true, data: { doctor, appointments: appointments.slice(0, 5), stats } });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

const getDoctorAppointmentsController = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.body.userId });
    if (!doctor) return res.status(404).send({ success: false, message: "Doctor not found" });

    const appointments = await Appointment.find({ doctorId: doctor._id.toString() }).sort({ createdAt: -1 });
    res.status(200).send({ success: true, data: appointments });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

const updateAppointmentStatusController = async (req, res) => {
  try {
    const { appointmentId, status } = req.body;
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) return res.status(404).send({ success: false, message: "Appointment not found" });

    appointment.status = status;
    await appointment.save();
    res.status(200).send({ success: true, message: `Appointment ${status} successfully!` });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

const getAllDoctorsController = async (req, res) => {
  try {
    const doctors = await Doctor.find({ status: "approved" });
    res.status(200).send({ success: true, data: doctors });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

const getDoctorByIdController = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.doctorId);
    if (!doctor) return res.status(404).send({ success: false, message: "Doctor not found" });
    res.status(200).send({ success: true, data: doctor });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

module.exports = {
  doctorRegisterController,
  getDoctorProfileController,
  doctorDashboardController,
  getDoctorAppointmentsController,
  updateAppointmentStatusController,
  getAllDoctorsController,
  getDoctorByIdController,
};
