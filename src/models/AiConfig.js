import mongoose from "mongoose";

const AiConfigSchema = new mongoose.Schema({
  name: { type: String, required: true },
  systemPrompt: { type: String, required: true },
  languages: { type: [String], default: ["en", "ar"] },
  allowedIntents: [String],
  blockedIntents: [String],
  version: { type: Number, default: 1 },
  isActive: { type: Boolean, default: false },
  approvedBy: String,
  approvedAt: Date
}, { timestamps: true });

export default mongoose.models.AiConfig ||
  mongoose.model("AiConfig", AiConfigSchema);
