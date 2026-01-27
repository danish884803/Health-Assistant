import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,

  // ✅ ADD
  patientName: String,
  patientId: String,

  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
  },

  doctorName: String,
  department: String,
  clinic: String,
  room: String,

  date: Date,
  time: String,

  status: {
    type: String,
    enum: ["booked", "rescheduled", "cancelled"],
    default: "booked",
  },
});

export default mongoose.models.Appointment ||
  mongoose.model("Appointment", AppointmentSchema);
