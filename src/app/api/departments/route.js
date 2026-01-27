import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Doctor from "@/models/Doctor";

export async function GET() {
  try {
    await connectDB();

    const departments = await Doctor.distinct("department");

    return NextResponse.json({ departments });
  } catch (err) {
    console.error("GET DEPARTMENTS ERROR:", err);
    return NextResponse.json({ departments: [] });
  }
}
