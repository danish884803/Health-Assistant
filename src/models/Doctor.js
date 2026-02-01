
import mongoose from "mongoose";

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

  // ✅ future ready
  mfaEnabled: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Doctor ||
  mongoose.model("Doctor", DoctorSchema);
