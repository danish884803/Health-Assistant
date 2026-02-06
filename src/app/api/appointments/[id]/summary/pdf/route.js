import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import mongoose from "mongoose";
import PDFDocument from "pdfkit";
import path from "path";

export async function GET(req, context) {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = verifyToken(token);

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const appointment = await Appointment.findById(id);
    if (!appointment || !appointment.medicalSummary) {
      return NextResponse.json({ error: "No summary found" }, { status: 404 });
    }

    if (
      user.role === "patient" &&
      appointment.userId.toString() !== user.id
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const fontPath = path.join(
      process.cwd(),
      "public/fonts/Roboto-Regular.ttf"
    );

    const pdfBuffer = await new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: "A4",
          margin: 50,
          font: fontPath, 
        });

        const chunks = [];

        doc.on("data", (chunk) => chunks.push(chunk));
        doc.on("end", () => resolve(Buffer.concat(chunks)));
        doc.on("error", reject);

        const s = appointment.medicalSummary;

        doc.fontSize(18).text("Medical Summary", { align: "center" });
        doc.moveDown();

        doc.fontSize(12).text(`Patient: ${appointment.patientName}`);
        doc.text(`Patient ID: ${appointment.patientId}`);
        doc.text(`Doctor: ${appointment.doctorName}`);
        doc.text(`Department: ${appointment.department}`);
        doc.text(`Clinic: ${appointment.clinic}`);
        doc.text(`Room: ${appointment.room}`);
        doc.text(
          `Date: ${new Date(appointment.date).toLocaleDateString()}`
        );
        doc.text(`Time: ${appointment.time}`);
        doc.moveDown();

        doc.fontSize(14).text("Diagnosis");
        doc.fontSize(12).text(s.diagnosis || "-");
        doc.moveDown();

        doc.fontSize(14).text("Notes");
        doc.fontSize(12).text(s.notes || "-");
        doc.moveDown();

        if (s.prescription) {
          doc.fontSize(14).text("Prescription");
          doc.fontSize(12).text(s.prescription);
          doc.moveDown();
        }

        if (s.followUpDate) {
          doc.text(
            `Follow-up Date: ${new Date(
              s.followUpDate
            ).toLocaleDateString()}`
          );
        }

        doc.end();
      } catch (e) {
        reject(e);
      }
    });

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="medical-summary-${id}.pdf"`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
  } catch (err) {
    console.error("PDF ERROR:", err);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
