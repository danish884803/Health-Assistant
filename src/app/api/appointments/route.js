import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { sendAppointmentEmail } from "@/lib/mailer";
import mongoose from "mongoose";


export async function POST(req) {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = verifyToken(token);
    const body = await req.json();

    const appointment = await Appointment.create({
      userId: new mongoose.Types.ObjectId(user.id),

      patientId: user.patientId,
      patientName: user.fullName,
      patientEmail: user.email,

      doctorId: new mongoose.Types.ObjectId(body.doctorId),
      doctorName: body.doctorName,
      department: body.department,
      clinic: body.clinic,


      room: body.room, 
      roomId: body.roomId ? new mongoose.Types.ObjectId(body.roomId) : null,

      date: new Date(body.date),
      time: body.time,
      status: "booked",
    });

    try {
      await sendAppointmentEmail({
        to: user.email,
        doctorName: appointment.doctorName,
        date: appointment.date,
        time: appointment.time,
        clinic: appointment.clinic,
        room: appointment.room,
      });
    } catch (e) {
      console.error("EMAIL ERROR:", e);
    }

    return NextResponse.json({ success: true, appointment });
  } catch (err) {
    console.error("BOOKING ERROR:", err);
    return NextResponse.json({ error: "Booking failed" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ appointments: [] });
    }

    const user = verifyToken(token);

    const appointments = await Appointment.find({
      userId: new mongoose.Types.ObjectId(user.id),
    }).sort({ date: 1 });

    return NextResponse.json({ appointments });
  } catch (err) {
    console.error("GET APPOINTMENTS ERROR:", err);
    return NextResponse.json({ appointments: [] });
  }
}
