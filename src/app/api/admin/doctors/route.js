import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/jwt";
import Doctor from "@/models/Doctor";
import AuditLog from "@/models/AuditLog";
import bcrypt from "bcryptjs";

/* =========================
   AUTH HELPER
========================= */
async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) throw new Error("UNAUTHORIZED");

  const admin = verifyToken(token);
  if (admin.role !== "admin") throw new Error("FORBIDDEN");

  return admin;
}

/* =========================
   GET — LIST DOCTORS
========================= */
export async function GET() {
  try {
    await connectDB();
    await requireAdmin();

    const doctors = await Doctor.find().sort({ createdAt: -1 });
    return NextResponse.json({ doctors });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

/* =========================
   POST — ADD DOCTOR
========================= */
export async function POST(req) {
  try {
    await connectDB();
    const admin = await requireAdmin();

    const {
      name,
      email,
      password,
      department,
      clinic,
      room,
      availability,
    } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email and password required" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const doctor = await Doctor.create({
      name,
      email,
      passwordHash,
      department,
      clinic,
      room,
      availability,
    });

    await AuditLog.create({
      actorId: admin.id,
      actorModel: "Admin",
      action: "CREATE_DOCTOR",
      targetType: "doctor",
      targetId: doctor._id.toString(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("CREATE DOCTOR ERROR:", err);
    return NextResponse.json({ error: "Failed to create doctor" }, { status: 500 });
  }
}

/* =========================
   PUT — UPDATE DOCTOR (WITH PASSWORD)
========================= */
export async function PUT(req) {
  try {
    await connectDB();
    const admin = await requireAdmin();

    const {
      doctorId,
      name,
      email,
      password,
      department,
      clinic,
      room,
      availability,
    } = await req.json();

    const updateData = {
      name,
      email,
      department,
      clinic,
      room,
      availability,
    };

    // 🔐 Only hash password if provided
    if (password && password.trim() !== "") {
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }

    const updated = await Doctor.findByIdAndUpdate(
      doctorId,
      updateData,
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    await AuditLog.create({
      actorId: admin.id,
      actorModel: "Admin",
      action: "UPDATE_DOCTOR",
      targetType: "doctor",
      targetId: doctorId,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("UPDATE DOCTOR ERROR:", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

/* =========================
   DELETE — REMOVE DOCTOR
========================= */
export async function DELETE(req) {
  try {
    await connectDB();
    const admin = await requireAdmin();

    const { doctorId } = await req.json();

    await Doctor.findByIdAndDelete(doctorId);

    await AuditLog.create({
      actorId: admin.id,
      actorModel: "Admin",
      action: "DELETE_DOCTOR",
      targetType: "doctor",
      targetId: doctorId,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
