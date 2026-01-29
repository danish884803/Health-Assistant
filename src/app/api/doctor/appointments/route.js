// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/mongodb";
// import Appointment from "@/models/Appointment";
// import { cookies } from "next/headers";
// import { verifyToken } from "@/lib/jwt";
// import mongoose from "mongoose";

// export async function GET() {
//   try {
//     await connectDB();

//     const cookieStore = await cookies();
//     const token = cookieStore.get("token")?.value;

//     if (!token) {
//       return NextResponse.json({ appointments: [] });
//     }

//     const decoded = verifyToken(token);

//     // 🔥 CRITICAL FIX — cast to ObjectId
//     const doctorObjectId = new mongoose.Types.ObjectId(decoded.id);

//     const appointments = await Appointment.find({
//       doctorId: doctorObjectId,
//     }).sort({ date: 1 });

//     return NextResponse.json({ appointments });
//   } catch (err) {
//     console.error("DOCTOR APPOINTMENTS ERROR:", err);
//     return NextResponse.json({ appointments: [] });
//   }
// }
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import mongoose from "mongoose";
import { logAudit } from "@/lib/audit";

export async function GET(req) {
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

    // ✅ AUDIT LOG
    await logAudit({
      actorId: doctor.id,
      actorModel: "Doctor",
      action: "VIEW_APPOINTMENTS",
      targetType: "appointment",
      metadata: { count: appointments.length },
      req,
    });

    return NextResponse.json({ appointments });
  } catch (err) {
    console.error("DOCTOR APPOINTMENTS ERROR:", err);
    return NextResponse.json({ appointments: [] });
  }
}
