import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/jwt";
import AuditLog from "@/models/AuditLog";

/* =========================
   GET — AUDIT LOGS
========================= */
export async function GET() {
  try {
    await connectDB();

    const token = cookies().get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const admin = verifyToken(token);
    if (admin.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const logs = await AuditLog.find()
      .sort({ createdAt: -1 })
      .limit(100);

    return NextResponse.json({ logs });
  } catch (err) {
    console.error("ADMIN AUDIT ERROR:", err);
    return NextResponse.json({ error: "Failed to load audit logs" }, { status: 500 });
  }
}
