import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Room from "@/models/HospitalRoom";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";

export async function GET() {
  await connectDB();
  return NextResponse.json({ rooms: await Room.find() });
}

export async function PUT(req) {
  await connectDB();

  const token = (await cookies()).get("token")?.value;
  const admin = verifyToken(token);
  if (admin.role !== "admin") return NextResponse.json({}, { status: 403 });

  const { roomId, gridArea } = await req.json();

  await Room.findByIdAndUpdate(roomId, { gridArea });
  return NextResponse.json({ success: true });
}
