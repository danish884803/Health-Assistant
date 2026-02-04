import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import mongoose from "mongoose";
import { logAudit } from "@/lib/audit";

export async function GET() {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json({ appointments: [] });
    }

    const doctor = verifyToken(token);
    const doctorObjectId = new mongoose.Types.ObjectId(doctor.id);

    const appointments = await Appointment.find({
      doctorId: doctorObjectId,
    }).sort({ date: 1 });

    const now = new Date();

    // 🔥 NORMALIZE STATUS (REAL HOSPITAL LOGIC)
    const normalized = appointments.map((a) => {
      const appointmentTime = new Date(a.date);
      if (a.time) {
        const [h, m] = a.time.split(":");
        appointmentTime.setHours(h, m, 0, 0);
      }

      let status = a.status || "booked";

      // ✅ COMPLETED: summary exists OR time passed
      if (
        status !== "cancelled" &&
        (a.medicalSummary?.sentAt || appointmentTime < now)
      ) {
        status = "completed";
      }

      return {
        ...a.toObject(),
        status,
      };
    });

    // 🧾 AUDIT
    await logAudit({
      actorId: doctor.id,
      actorModel: "Doctor",
      action: "VIEW_APPOINTMENTS",
      targetType: "appointment",
      metadata: { count: normalized.length },
    });

    return NextResponse.json({ appointments: normalized });
  } catch (err) {
    console.error("DOCTOR APPOINTMENTS ERROR:", err);
    return NextResponse.json({ appointments: [] });
  }
}
