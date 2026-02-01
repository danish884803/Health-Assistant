// src/models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["patient", "doctor", "admin"],
      default: "patient",
    },

    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    // ✅ REQUIRED ONLY FOR PATIENTS
    patientId: {
      type: String,
      unique: true,
      sparse: true, // 🔥 allows admin/doctor without patientId
    },

    phone: String,
    emiratesId: String,
    dob: Date,

    emailVerified: {
      type: Boolean,
      default: false,
    },

    emailOtp: String,
    emailOtpExpiry: Date,
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model("User", UserSchema);
