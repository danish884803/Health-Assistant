import { NextResponse } from "next/server";
import openai from "@/lib/openai";
import { connectDB } from "@/lib/mongodb";
import AiConfig from "@/models/AiConfig";
import AiAuditLog from "@/models/AiAuditLog";
import { checkRateLimit } from "@/lib/rateLimit";
import HospitalRoom from "@/models/HospitalRoom";

export async function POST(req) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    if (!(await checkRateLimit(ip, 10))) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    await connectDB();
    const config = await AiConfig.findOne({ isActive: true });
    if (!config) return NextResponse.json({ error: "AI disabled" }, { status: 503 });

    const { messages } = await req.json();
    const userMessage = messages[messages.length - 1].content;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: config.systemPrompt },
        { role: "user", content: userMessage },
      ],
    });

    const raw = completion.choices[0].message.content;

    await AiAuditLog.create({ ip, question: userMessage, status: "SUCCESS" });

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return NextResponse.json({ content: raw });
    }

    if (parsed.intent === "NAVIGATE_DEPARTMENT") {
      const room = await HospitalRoom.findOne({
        name: new RegExp(parsed.department, "i"),
      });

      if (!room) {
        return NextResponse.json({ content: `No map found for ${parsed.department}.` });
      }

      return NextResponse.json({
        intent: "NAVIGATE",
        roomCode: room.roomCode,
      });
    }

    return NextResponse.json(parsed);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ content: "Something went wrong." }, { status: 500 });
  }
}
