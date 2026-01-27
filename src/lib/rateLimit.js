import RateLimit from "@/models/RateLimit";
import { connectDB } from "@/lib/mongodb";

export async function checkRateLimit(key, limit = 10) {
  await connectDB();

  let record = await RateLimit.findOne({ key });

  if (!record) {
    await RateLimit.create({
      key,
      count: 1,
      expiresAt: new Date(Date.now() + 60 * 1000)
    });
    return true;
  }

  if (record.count >= limit) return false;

  record.count += 1;
  await record.save();
  return true;
}
