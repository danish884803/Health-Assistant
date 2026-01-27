// src/models/Appointment.js
import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
  // Patient
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  patientId: {
    type: String, // PAT-2026-XXXX
    required: true,
  },

  patientName: {
    type: String,
    required: true,
  },

  // Doctor
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },

  doctorName: String,
  department: String,
  clinic: String,
  room: String,

  date: {
    type: Date,
    required: true,
  },

  time: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    enum: ["booked", "rescheduled", "cancelled"],
    default: "booked",
  },
}, { timestamps: true });

export default mongoose.models.Appointment ||
  mongoose.model("Appointment", AppointmentSchema);
