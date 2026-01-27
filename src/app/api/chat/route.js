import { NextResponse } from "next/server";
import openai from "@/lib/openai";
import { connectDB } from "@/lib/mongodb";
import AiConfig from "@/models/AiConfig";
import AiAuditLog from "@/models/AiAuditLog";
import { checkRateLimit } from "@/lib/rateLimit";

export async function POST(req) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const allowed = await checkRateLimit(ip, 10);

  if (!allowed) {
    await AiAuditLog.create({ ip, status: "RATE_LIMITED" });
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  await connectDB();
  const aiConfig = await AiConfig.findOne({ isActive: true });

  if (!aiConfig)
    return NextResponse.json({ error: "AI disabled" }, { status: 503 });

  const { messages, language = "en" } = await req.json();
  const userMessage = messages[messages.length - 1].content;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: aiConfig.systemPrompt },
      { role: "user", content: userMessage }
    ]
  });

  await AiAuditLog.create({
    userType: "PUBLIC",
    question: userMessage,
    language,
    aiVersion: aiConfig.version,
    status: "SUCCESS",
    ip
  });

  return NextResponse.json(response.choices[0].message);
}
