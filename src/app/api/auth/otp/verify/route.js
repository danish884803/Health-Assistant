import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { signToken } from "@/lib/jwt";

export async function POST(req) {
  const { emailOrId, otp } = await req.json();
  await connectDB();

  const user = await User.findOne({
    $or: [{ email: emailOrId }, { patientId: emailOrId }],
    role: "patient",
  });

  if (!user || user.otpCode !== otp || user.otpExpiry < new Date()) {
    return NextResponse.json({ error: "Invalid OTP" }, { status: 401 });
  }

  user.otpCode = null;
  user.otpExpiry = null;
  user.lastLogin = new Date();
  await user.save();

  const token = signToken({
    id: user._id,
    role: user.role,
    email: user.email,
  });

  const res = NextResponse.json({ success: true, role: "patient" });

  res.cookies.set("token", token, {
    httpOnly: true,
    secure: true,
    path: "/",
  });

  return res;
}
