import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["patient", "doctor", "admin"],
      default: "patient",
    },

    fullName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    passwordHash: { type: String, required: true },

    patientId: {
      type: String,
      unique: true,
      sparse: true,
    },

    phone: String,
    emiratesId: String,
    dob: Date,

    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
    },

    heightCm: Number,
    weightKg: Number,

    emailVerified: { type: Boolean, default: false },

    emailOtp: {
      type: String,
    },
    emailOtpExpiry: {
      type: Date,
    },
  },
  { timestamps: true }
);

UserSchema.virtual("bmi").get(function () {
  if (!this.heightCm || !this.weightKg) return null;
  const h = this.heightCm / 100;
  return (this.weightKg / (h * h)).toFixed(1);
});

export default mongoose.models.User ||
  mongoose.model("User", UserSchema);