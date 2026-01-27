import mongoose from "mongoose";

const AuditLogSchema = new mongoose.Schema({
  actorId: mongoose.Schema.Types.ObjectId,
  actorRole: String,          // doctor / admin
  action: String,             // VIEW_APPOINTMENT, SEND_EMAIL
  targetId: mongoose.Schema.Types.ObjectId,
  timestamp: { type: Date, default: Date.now },
  meta: Object,
});

export default mongoose.models.AuditLog ||
  mongoose.model("AuditLog", AuditLogSchema);
