import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { generateEmailOtp } from "@/lib/emailOtp";
import { sendEmailOtp } from "@/lib/mailer";

function generatePatientId() {
  const year = new Date().getFullYear();
  const random = Math.floor(100000 + Math.random() * 900000);
  return `SKGH-${year}-${random}`;
}

export async function POST(req) {
  try {
    const { fullName, email, password, phone, emiratesId, dob } =
      await req.json();

    if (!password || password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    await connectDB();

    const exists = await User.findOne({ email });
    if (exists) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const otp = generateEmailOtp();
    const patientId = generatePatientId();

    await User.create({
      fullName,
      email,
      passwordHash,
      patientId,
      phone,
      emiratesId,
      dob,
      emailOtp: otp,
      emailOtpExpiry: new Date(Date.now() + 10 * 60 * 1000),
      emailVerified: false,
      role: "patient",
    });

    await sendEmailOtp(email, otp);

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("REGISTER ERROR:", e);
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}
