
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { signJwt } from "@/lib/jwt";

export async function POST(req) {
  try {
    const { email, otp } = await req.json();

    const normalizedOtp = otp.toString().trim();

    await connectDB();

    const user = await User.findOne({
      email,
      emailOtp: normalizedOtp,
      emailOtpExpiry: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    user.emailVerified = true;
    user.emailOtp = null;
    user.emailOtpExpiry = null;
    await user.save();

    const freshUser = await User.findById(user._id);
    const token = signJwt(freshUser);

    const res = NextResponse.json({ success: true });

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (e) {
    console.error("VERIFY EMAIL ERROR:", e);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}