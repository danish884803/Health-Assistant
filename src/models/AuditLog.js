import mongoose from "mongoose";

const AuditLogSchema = new mongoose.Schema({
  actorId: mongoose.Schema.Types.ObjectId,
  actorRole: String, // doctor | admin
  action: String,    // VIEW_APPOINTMENT, RESCHEDULE, EMAIL_SENT
  targetId: mongoose.Schema.Types.ObjectId,
  ip: String,
  userAgent: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.AuditLog ||
  mongoose.model("AuditLog", AuditLogSchema);
