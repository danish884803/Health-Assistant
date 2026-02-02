import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import mongoose from "mongoose";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get("doctorId");
    const date = searchParams.get("date");
    const time = searchParams.get("time");

    if (!doctorId || !date || !time) {
      return NextResponse.json({ booked: false });
    }

    const exists = await Appointment.findOne({
      doctorId: new mongoose.Types.ObjectId(doctorId),
      date: new Date(date),
      time,
      status: { $ne: "cancelled" },
    });

    return NextResponse.json({ booked: !!exists });
  } catch (err) {
    console.error("SLOT CHECK ERROR:", err);
    return NextResponse.json({ booked: false });
  }
}
