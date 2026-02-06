
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
      return NextResponse.json(
        { error: "Doctor not found" },
        { status: 401 }
      );
    }

    const ok = await bcrypt.compare(password, doctor.passwordHash);
    if (!ok) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

  doctor.role = "doctor";
const token = signJwt(doctor);


    const res = NextResponse.json({ success: true });

    res.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (err) {
    console.error("DOCTOR LOGIN ERROR:", err);
    return NextResponse.json(
      { error: "Doctor login failed" },
      { status: 500 }
    );
  }
}
