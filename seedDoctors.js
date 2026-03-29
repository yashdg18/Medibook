

const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Doctor = require("./models/doctorModel");

const sampleDoctors = [
  {
    userId: "seed001",
    firstName: "Priya",
    lastName: "Sharma",
    phone: "9876543210",
    email: "priya.sharma@medibook.in",
    address: "Apollo Hospital, Pune",
    specialization: "Cardiologist",
    experience: "12",
    feesPerConsultation: 800,
    timings: { start: "09:00", end: "17:00" },
    status: "approved",
  },
  {
    userId: "seed002",
    firstName: "Rahul",
    lastName: "Mehta",
    phone: "9876543211",
    email: "rahul.mehta@medibook.in",
    address: "Ruby Hall Clinic, Pune",
    specialization: "Dermatologist",
    experience: "8",
    feesPerConsultation: 600,
    timings: { start: "10:00", end: "18:00" },
    status: "approved",
  },
  {
    userId: "seed003",
    firstName: "Anjali",
    lastName: "Desai",
    phone: "9876543212",
    email: "anjali.desai@medibook.in",
    address: "Jehangir Hospital, Pune",
    specialization: "Pediatrician",
    experience: "15",
    feesPerConsultation: 700,
    timings: { start: "08:00", end: "16:00" },
    status: "approved",
  },
  {
    userId: "seed004",
    firstName: "Vikram",
    lastName: "Joshi",
    phone: "9876543213",
    email: "vikram.joshi@medibook.in",
    address: "KEM Hospital, Pune",
    specialization: "Orthopedic Surgeon",
    experience: "20",
    feesPerConsultation: 1000,
    timings: { start: "11:00", end: "19:00" },
    status: "approved",
  },
  {
    userId: "seed005",
    firstName: "Sneha",
    lastName: "Patil",
    phone: "9876543214",
    email: "sneha.patil@medibook.in",
    address: "Sassoon General Hospital, Pune",
    specialization: "General Physician",
    experience: "6",
    feesPerConsultation: 400,
    timings: { start: "09:00", end: "13:00" },
    status: "approved",
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ MongoDB connected");

    await Doctor.deleteMany({ userId: { $in: sampleDoctors.map((d) => d.userId) } });
    await Doctor.insertMany(sampleDoctors);

    console.log("✅ Sample doctors added successfully!");
    console.log("   → 5 doctors inserted");
    console.log("   → Now start the server and visit /doctors");
  } catch (err) {
    console.error("❌ Seed error:", err.message);
  } finally {
    mongoose.connection.close();
  }
};

seedDB();
