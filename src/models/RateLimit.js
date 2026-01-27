import mongoose from "mongoose";

const RateLimitSchema = new mongoose.Schema({
  key: String,
  count: Number,
  expiresAt: { type: Date, index: { expires: 60 } }
});

export default mongoose.models.RateLimit ||
  mongoose.model("RateLimit", RateLimitSchema);
