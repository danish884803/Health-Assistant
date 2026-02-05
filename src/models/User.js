// // src/models/User.js
// import mongoose from "mongoose";

// const UserSchema = new mongoose.Schema(
//   {
//     role: {
//       type: String,
//       enum: ["patient", "doctor", "admin"],
//       default: "patient",
//     },

//     fullName: {
//       type: String,
//       required: true,
//     },

//     email: {
//       type: String,
//       unique: true,
//       required: true,
//     },

//     passwordHash: {
//       type: String,
//       required: true,
//     },

//     // ✅ REQUIRED ONLY FOR PATIENTS
//     patientId: {
//       type: String,
//       unique: true,
//       sparse: true, // 🔥 allows admin/doctor without patientId
//     },

//     phone: String,
//     emiratesId: String,
//     dob: Date,

//     emailVerified: {
//       type: Boolean,
//       default: false,
//     },

//     emailOtp: String,
//     emailOtpExpiry: Date,
//   },
//   { timestamps: true }
// );

// export default mongoose.models.User ||
//   mongoose.model("User", UserSchema);
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

    /* ===== HEALTH DATA ===== */
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
    },

    heightCm: Number, // 170
    weightKg: Number, // 70

    emailVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

/* BMI virtual */
UserSchema.virtual("bmi").get(function () {
  if (!this.heightCm || !this.weightKg) return null;
  const h = this.heightCm / 100;
  return (this.weightKg / (h * h)).toFixed(1);
});

export default mongoose.models.User ||
  mongoose.model("User", UserSchema);
