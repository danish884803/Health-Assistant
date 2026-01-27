import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { signJwt } from "@/lib/jwt";

export async function POST(req) {
  try {
    const { email, otp } = await req.json();

    await connectDB();

    const user = await User.findOne({
      email,
      emailOtp: otp,
      emailOtpExpiry: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }

    user.emailVerified = true;
    user.emailOtp = null;
    user.emailOtpExpiry = null;
    await user.save();

    const token = signJwt(user);

    const res = NextResponse.json({ success: true });
    res.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    });

    return res;
  } catch (e) {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
