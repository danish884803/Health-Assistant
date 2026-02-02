import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { connectDB } from "@/lib/mongodb";
import AiConfig from "@/models/AiConfig";

/* =========================
   GET CONFIG
========================= */
export async function GET() {
  await connectDB();

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = verifyToken(token);
  if (admin.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let config = await AiConfig.findOne({ isActive: true });

  // Auto-create default config if missing
  if (!config) {
    config = await AiConfig.create({
      name: "Hospital Assistant",
      systemPrompt: "You are a hospital assistant...",
      languages: ["en"],
      isActive: false,
    });
  }

  return NextResponse.json({ config });
}

/* =========================
   UPDATE CONFIG
========================= */
export async function PUT(req) {
  await connectDB();

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = verifyToken(token);
  if (admin.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();

  await AiConfig.updateMany({}, { isActive: false });

  const updated = await AiConfig.findByIdAndUpdate(
    body._id,
    {
      ...body,
      approvedBy: admin.email,
      approvedAt: new Date(),
      isActive: true,
    },
    { new: true }
  );

  return NextResponse.json({ success: true, config: updated });
}
