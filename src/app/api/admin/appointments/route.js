import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/jwt";
import Appointment from "@/models/Appointment";
import Doctor from "@/models/Doctor";

export async function GET() {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const admin = verifyToken(token);
    if (admin.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const appointments = await Appointment.find()
      .sort({ date: 1, time: 1 });

    const doctors = await Doctor.find().select(
      "name department clinic room availability"
    );

    return NextResponse.json({ appointments, doctors });
  } catch (err) {
    console.error("ADMIN APPOINTMENTS ERROR:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
