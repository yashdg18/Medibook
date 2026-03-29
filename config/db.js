const mongoose = require("mongoose");
const colors   = require("colors");

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB Connected: ${mongoose.connection.host}`.bgGreen.white);
  } catch (error) {
    console.log(`MongoDB Connection Error: ${error.message}`.bgRed.white);
    process.exit(1);
  }
};

module.exports = connectDB;
