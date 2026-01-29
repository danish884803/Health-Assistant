import mongoose from "mongoose";

const AuditLogSchema = new mongoose.Schema(
  {
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "actorModel",
    },

    actorModel: {
      type: String,
      enum: ["Doctor", "Admin"],
      required: true,
    },

    action: {
      type: String,
      required: true,
    },

    targetType: {
      type: String, // patient | appointment | report
      required: true,
    },

    targetId: {
      type: String,
    },

    metadata: {
      type: Object,
      default: {},
    },

    ipAddress: String,
    userAgent: String,
  },
  { timestamps: true }
);

export default mongoose.models.AuditLog ||
  mongoose.model("AuditLog", AuditLogSchema);
