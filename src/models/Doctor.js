
import mongoose from "mongoose";

// const DoctorSchema = new mongoose.Schema({
//   name: String,
//   department: String,
//   clinic: String,
//   room: String,

//   availability: {
//     days: [String], // ["Monday","Tuesday","Wednesday"]
//     startTime: String, // "09:00"
//     endTime: String,   // "17:00"
//     slotDuration: Number, // minutes (e.g. 30)
//   },
// });
const DoctorSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  passwordHash: String,
  department: String,
  clinic: String,
  room: String,
  availability: {
    days: [String],
    startTime: String,
    endTime: String,
    slotDuration: Number,
  },
});

export default mongoose.models.Doctor ||
  mongoose.model("Doctor", DoctorSchema);
