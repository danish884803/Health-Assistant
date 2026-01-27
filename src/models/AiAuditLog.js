import mongoose from "mongoose";

const AiAuditLogSchema = new mongoose.Schema({
  userId: String,
  userType: { type: String, enum: ["PUBLIC", "PATIENT", "DOCTOR", "ADMIN"] },
  question: String,
  language: String,
  aiVersion: Number,
  status: String,
  ip: String
}, { timestamps: true });

export default mongoose.models.AiAuditLog ||
  mongoose.model("AiAuditLog", AiAuditLogSchema);
