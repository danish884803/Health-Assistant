// import { NextResponse } from 'next/server';
// import openai, { SYSTEM_PROMPT } from '@/lib/openai';

// export async function POST(req) {
//     try {
//         const { messages } = await req.json();

//         if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('...')) {
//             // Fallback for demo without real key
//             const lastUserMessage = messages[messages.length - 1].content;
//             return NextResponse.json({
//                 role: 'assistant',
//                 content: `[DEMO MODE] You asked: "${lastUserMessage}". This is a simulated response because the OpenAI API key is not configured. Sheikh Khalifa Hospital – Fujairah welcomes you!`
//             });
//         }

//         const response = await openai.chat.completions.create({
//             model: 'gpt-4o-mini',
//             messages: [
//                 { role: 'system', content: SYSTEM_PROMPT },
//                 ...messages,
//             ],
//         });

//         return NextResponse.json(response.choices[0].message);
//     } catch (error) {
//         console.error('Chat API Error:', error);
//         return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//     }
// }
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
