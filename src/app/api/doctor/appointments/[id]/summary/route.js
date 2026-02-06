import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import mongoose from "mongoose";
import { sendMedicalSummaryEmail } from "@/lib/mailer";
import { generateMedicalSummaryPDF } from "@/lib/pdfGenerator";

export async function POST(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid appointment ID" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const doctor = verifyToken(token);
    if (doctor.role !== "doctor") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { diagnosis, notes, prescription, followUpDate } = body;

    if (!diagnosis || !notes) {
      return NextResponse.json(
        { error: "Diagnosis and notes are required" },
        { status: 400 }
      );
    }

const appointment = await Appointment.findOneAndUpdate(
  {
    _id: new mongoose.Types.ObjectId(id),
    doctorId: new mongoose.Types.ObjectId(doctor.id),
  },
  {
    medicalSummary: {
      diagnosis,
      notes,
      prescription,
      followUpDate: followUpDate ? new Date(followUpDate) : null,
      sentAt: new Date(),
    },
    status: "completed", 
  },
  { new: true }
);

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    const pdfBuffer = await generateMedicalSummaryPDF(appointment);

    await sendMedicalSummaryEmail({
      to: appointment.patientEmail,
      patientName: appointment.patientName,
      pdfBuffer,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("MEDICAL SUMMARY ERROR:", err);
    return NextResponse.json(
      { error: "Failed to save medical summary" },
      { status: 500 }
    );
  }
}
