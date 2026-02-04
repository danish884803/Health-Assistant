import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/jwt";
import HospitalFloor from "@/models/HospitalFloor";

export async function GET() {
  await connectDB();
  const token = (await cookies()).get("token")?.value;
  const admin = verifyToken(token);

  if (admin.role !== "admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const floors = await HospitalFloor.find().sort({ level: 1 });
  return NextResponse.json({ floors });
}

export async function POST(req) {
  await connectDB();
  const token = (await cookies()).get("token")?.value;
  const admin = verifyToken(token);

  if (admin.role !== "admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { name, level } = await req.json();
  const floor = await HospitalFloor.create({ name, level });

  return NextResponse.json({ floor });
}

export async function DELETE(req) {
  await connectDB();
  const token = (await cookies()).get("token")?.value;
  const admin = verifyToken(token);

  if (admin.role !== "admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await req.json();
  await HospitalFloor.findByIdAndDelete(id);

  return NextResponse.json({ success: true });
}
