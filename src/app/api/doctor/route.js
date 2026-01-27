// import { NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import { verifyToken } from "@/lib/jwt";
// import Appointment from "@/models/Appointment";
// import mongoose from "mongoose";

// export async function GET() {
//   try {
//     const cookieStore = await cookies();
//     const token = cookieStore.get("token")?.value;
//     if (!token) return NextResponse.json({ appointments: [] });

//     const doctor = verifyToken(token);
//     if (doctor.role !== "doctor") {
//       return NextResponse.json({ error: "Forbidden" }, { status: 403 });
//     }

//     const appointments = await Appointment.find({
//       doctorId: new mongoose.Types.ObjectId(doctor.id),
//     }).sort({ date: 1 });

//     return NextResponse.json({ appointments });
//   } catch {
//     return NextResponse.json({ appointments: [] });
//   }
// }
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Doctor from "@/models/Doctor";


export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const department = searchParams.get("department");

    const query = {};

    if (department) {
      query.department = department;
    }

    const doctors = await Doctor.find(query).select(
      "_id name department clinic room availability"
    );

    return NextResponse.json({ doctors });
  } catch (err) {
    console.error("GET DOCTORS ERROR:", err);
    return NextResponse.json(
      { error: "Failed to load doctors" },
      { status: 500 }
    );
  }
}
