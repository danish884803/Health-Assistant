import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import mongoose from "mongoose";
import { logAudit } from "@/lib/audit";
import { sendAppointmentRescheduledEmail } from "@/lib/mailer";
import { sendAppointmentCancelledEmail } from "@/lib/mailer";
/* =========================
   UPDATE (RESCHEDULE)
========================= */
export async function PUT(req, context) {
  try {
    await connectDB();

    // 🔥 FIX: params is async
    const { id } = await context.params;

    const body = await req.json();
    const { date, time } = body;

    if (!date || !time) {
      return NextResponse.json(
        { error: "Date and time required" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = verifyToken(token);

    const appointment = await Appointment.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(id),
        userId: new mongoose.Types.ObjectId(user.id),
      },
      {
        date: new Date(date),
        time,
        status: "rescheduled",
      },
      { new: true }
    );

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }
    await sendAppointmentRescheduledEmail({
  to: user.email,
  doctorName: appointment.doctorName,
  date: appointment.date,
  time: appointment.time,
  clinic: appointment.clinic,
  room: appointment.room,
});
await logAudit({
  actorId: user.id,
  actorModel: "Doctor",
  action: "RESCHEDULE_APPOINTMENT",
  targetType: "appointment",
  targetId: appointment._id.toString(),
  metadata: {
    newDate: appointment.date,
    newTime: appointment.time,
  },
  req,
});
    return NextResponse.json({
      appointment,
    });
  } catch (err) {
    console.error("RESCHEDULE ERROR:", err);
    return NextResponse.json(
      { error: "Failed to reschedule" },
      { status: 500 }
    );
  }
}

/* =========================
   DELETE (CANCEL)
========================= */
export async function DELETE(req, context) {
  try {
    await connectDB();

    // 🔥 FIX: params is async
    const { id } = await context.params;

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = verifyToken(token);

    const appointment = await Appointment.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(id),
        userId: new mongoose.Types.ObjectId(user.id),
      },
      { status: "cancelled" },
      { new: true }
    );

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }
    
await sendAppointmentCancelledEmail({
  to: user.email,
  doctorName: appointment.doctorName,
  date: appointment.date,
  time: appointment.time,
});
await logAudit({
  actorId: user.id,
  actorModel: "Doctor",
  action: "CANCEL_APPOINTMENT",
  targetType: "appointment",
  targetId: appointment._id.toString(),
  metadata: {
    reason: "Cancelled by doctor",
  },
  req,
});

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("CANCEL ERROR:", err);
    return NextResponse.json(
      { error: "Failed to cancel" },
      { status: 500 }
    );
  }
}
