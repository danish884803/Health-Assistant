import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import HospitalFloor from "@/models/HospitalFloor";
import HospitalRoom from "@/models/HospitalRoom";

export async function GET() {
  await connectDB();

  const floors = await HospitalFloor.find().sort({ level: 1 });
  const rooms = await HospitalRoom
    .find()
    .populate("floorId", "name level");

  return NextResponse.json({ floors, rooms });
}
