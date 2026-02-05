import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/jwt";
import Appointment from "@/models/Appointment";
import User from "@/models/User";
import mongoose from "mongoose";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const doctor = verifyToken(token);
    if (!doctor || doctor.role !== "doctor") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    // Validate if ID is a valid MongoDB ObjectId to avoid 500 errors
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid Appointment ID" }, { status: 400 });
    }

    const appointment = await Appointment.findById(id).populate(
      "userId",
      "fullName email patientId bloodGroup heightCm weightKg"
    );

    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    if (appointment.doctorId.toString() !== doctor.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const patient = appointment.userId;
    if (!patient) {
      return NextResponse.json({ error: "Patient data missing" }, { status: 404 });
    }

    const h = patient.heightCm / 100;
    const bmi = (patient.heightCm && patient.weightKg) 
      ? (patient.weightKg / (h * h)).toFixed(1) 
      : null;

    return NextResponse.json({
      patient: {
        fullName: patient.fullName,
        patientId: patient.patientId,
        email: patient.email,
        bloodGroup: patient.bloodGroup,
        heightCm: patient.heightCm,
        weightKg: patient.weightKg,
        bmi
      },
    });
  } catch (err) {
    console.error("API ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}