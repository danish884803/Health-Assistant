import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import Doctor from "@/models/Doctor";
import { signJwt } from "@/lib/jwt";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    await connectDB();

    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, doctor.passwordHash);
    if (!ok) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // 🔐 MFA placeholder (phase 2)
    // if (doctor.mfaEnabled) send OTP here

   const token = signJwt({
  id: doctor._id.toString(), // ✅ STRING
  role: "doctor",
  email: doctor.email,
  name: doctor.name,
});


    const res = NextResponse.json({ success: true });

    res.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
    });

    return res;
  } catch (e) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
