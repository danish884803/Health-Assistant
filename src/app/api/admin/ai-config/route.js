import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongoose";
import AiConfig from "@/models/AiConfig";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await connectDB();
  await AiConfig.updateMany({}, { isActive: false });

  const body = await req.json();

  const config = await AiConfig.create({
    ...body,
    isActive: true,
    approvedBy: session.user.id,
    approvedAt: new Date()
  });

  return NextResponse.json(config);
}

export async function GET() {
  await connectDB();
  const config = await AiConfig.findOne({ isActive: true });
  return NextResponse.json(config);
}
