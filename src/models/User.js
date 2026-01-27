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

    patientId: {
      type: String,
      unique: true,
      required: true,
    },

    phone: String,       // collected only
    emiratesId: String, // collected only
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

export default mongoose.models.User || mongoose.model("User", UserSchema);
