// import { NextResponse } from "next/server";
// import openai from "@/lib/openai";
// import { connectDB } from "@/lib/mongodb";
// import AiConfig from "@/models/AiConfig";
// import AiAuditLog from "@/models/AiAuditLog";
// import { checkRateLimit } from "@/lib/rateLimit";

// export async function POST(req) {
//   const ip = req.headers.get("x-forwarded-for") || "unknown";
//   const allowed = await checkRateLimit(ip, 10);

//   if (!allowed) {
//     await AiAuditLog.create({ ip, status: "RATE_LIMITED" });
//     return NextResponse.json({ error: "Too many requests" }, { status: 429 });
//   }

//   await connectDB();
//   const aiConfig = await AiConfig.findOne({ isActive: true });

//   if (!aiConfig)
//     return NextResponse.json({ error: "AI disabled" }, { status: 503 });

//   const { messages, language = "en" } = await req.json();
//   const userMessage = messages[messages.length - 1].content;

//   const response = await openai.chat.completions.create({
//     model: "gpt-4o-mini",
//     messages: [
//       { role: "system", content: aiConfig.systemPrompt },
//       { role: "user", content: userMessage }
//     ]
//   });

//   await AiAuditLog.create({
//     userType: "PUBLIC",
//     question: userMessage,
//     language,
//     aiVersion: aiConfig.version,
//     status: "SUCCESS",
//     ip
//   });

//   return NextResponse.json(response.choices[0].message);
// }
import { NextResponse } from "next/server";
import openai from "@/lib/openai";
import { connectDB } from "@/lib/mongodb";
import AiConfig from "@/models/AiConfig";
import AiAuditLog from "@/models/AiAuditLog";
import { checkRateLimit } from "@/lib/rateLimit";
import HospitalRoom from "@/models/HospitalRoom";
import HospitalFloor from "@/models/HospitalFloor";

export async function POST(req) {
  try {
    /* =========================
       RATE LIMIT
    ========================= */
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const allowed = await checkRateLimit(ip, 10);

    if (!allowed) {
      await AiAuditLog.create({ ip, status: "RATE_LIMITED" });
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      );
    }

    /* =========================
       DB + CONFIG
    ========================= */
    await connectDB();
    const aiConfig = await AiConfig.findOne({ isActive: true });

    if (!aiConfig) {
      return NextResponse.json(
        { error: "AI disabled" },
        { status: 503 }
      );
    }

    /* =========================
       REQUEST BODY
    ========================= */
    const { messages, language = "en" } = await req.json();
    const userMessage = messages[messages.length - 1].content;

    /* =========================
       OPENAI CALL
    ========================= */
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: aiConfig.systemPrompt },
        { role: "user", content: userMessage },
      ],
    });

    const rawReply = completion.choices[0].message.content;

    /* =========================
       AUDIT LOG
    ========================= */
    await AiAuditLog.create({
      userType: "PUBLIC",
      question: userMessage,
      language,
      aiVersion: aiConfig.version,
      status: "SUCCESS",
      ip,
    });

    /* =========================
       SAFE JSON PARSE
    ========================= */
    let aiReply;
    try {
      aiReply = JSON.parse(rawReply);
    } catch {
      return NextResponse.json({ content: rawReply });
    }

    /* =========================
       NAVIGATION RESOLUTION
    ========================= */
    if (aiReply.intent === "NAVIGATE_DEPARTMENT") {
      const room = await HospitalRoom.findOne({
        name: new RegExp(aiReply.department, "i"),
      }).populate("floorId", "name");

      if (!room) {
        return NextResponse.json({
          content: `I couldn't find the ${aiReply.department} location in the hospital map.`,
        });
      }

      return NextResponse.json({
        intent: "NAVIGATE",
        roomCode: room.roomCode,
        content: `📍 ${room.name} is located on ${room.floorId?.name || "the hospital floor"}. Taking you there now.`,
      });
    }

    /* =========================
       DEFAULT CHAT RESPONSE
    ========================= */
    return NextResponse.json({
      content: aiReply.content || rawReply,
    });

  } catch (err) {
    console.error("CHAT API ERROR:", err);
    return NextResponse.json(
      { content: "Sorry, something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
