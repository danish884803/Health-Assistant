import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/jwt";
import User from "@/models/User";
import AuditLog from "@/models/AuditLog";

/* =========================
   GET — LIST PATIENTS
========================= */
export async function GET() {
  try {
    await connectDB();

    // ✅ NEXT.JS 16 FIX
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const admin = verifyToken(token);

    if (admin.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const patients = await User.find({ role: "patient" })
      .select("fullName email patientId phone emiratesId createdAt")
      .sort({ createdAt: -1 });

    return NextResponse.json({ patients });
  } catch (err) {
    console.error("ADMIN PATIENT LIST ERROR:", err);
    return NextResponse.json(
      { error: "Failed to load patients" },
      { status: 500 }
    );
  }
}

/* =========================
   PUT — UPDATE PATIENT (NON-MEDICAL)
========================= */
export async function PUT(req) {
  try {
    await connectDB();

    // ✅ NEXT.JS 16 FIX
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const admin = verifyToken(token);

    if (admin.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const { userId, phone, emiratesId } = await req.json();

    const updated = await User.findByIdAndUpdate(
      userId,
      { phone, emiratesId },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Patient not found" },
        { status: 404 }
      );
    }

    // 🧾 AUDIT LOG
    await AuditLog.create({
      actorId: admin.id,
      actorModel: "Admin",
      action: "UPDATE_PATIENT_PROFILE",
      targetType: "patient",
      targetId: updated._id.toString(),
      metadata: { phone, emiratesId },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("ADMIN PATIENT UPDATE ERROR:", err);
    return NextResponse.json(
      { error: "Update failed" },
      { status: 500 }
    );
  }
}
/* =========================
   DELETE — REMOVE PATIENT
========================= */
export async function DELETE(req) {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = verifyToken(token);
    if (admin.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { userId } = await req.json();

    const deleted = await User.findByIdAndDelete(userId);
    if (!deleted) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    /* 🧾 AUDIT LOG */
    await AuditLog.create({
      actorId: admin.id,
      actorModel: "Admin",
      action: "DELETE_PATIENT",
      targetType: "patient",
      targetId: userId,
      metadata: {
        email: deleted.email,
        patientId: deleted.patientId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("ADMIN PATIENT DELETE ERROR:", err);
    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    );
  }
}
