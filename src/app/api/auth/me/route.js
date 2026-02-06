
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ user: null });
    }

    const decoded = verifyToken(token);

    return NextResponse.json({
      user: {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        name: decoded.name || null,          
        fullName: decoded.fullName || null,  
        patientId: decoded.patientId || null,
      },
    });
  } catch (err) {
    console.error("AUTH ME ERROR:", err);
    return NextResponse.json({ user: null });
  }
}
