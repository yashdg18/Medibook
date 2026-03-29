const express   = require("express");
const colors    = require("colors");
const morgan    = require("morgan");
const dotenv    = require("dotenv");
const path      = require("path");
const mongoose  = require("mongoose");
const connectDB = require("./config/db");

// Load env vars
dotenv.config();

// Fix mongoose strictQuery deprecation warning
mongoose.set("strictQuery", false);

// Connect MongoDB
connectDB();

const app = express();

// Middlewares
app.use(express.json());
app.use(morgan("dev"));


app.use("/api/v1/user",        require("./routes/userRoutes"));
app.use("/api/v1/doctor",      require("./routes/doctorRoutes"));
app.use("/api/v1/appointment", require("./routes/appointmentRoutes"));


const buildPath = path.join(__dirname, "client", "build");
app.use(express.static(buildPath));

// 
app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

// 
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.bgCyan.white);
});
