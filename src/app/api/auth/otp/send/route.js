import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { generateOTP } from "@/lib/otp";

export async function POST(req) {
  const { emailOrId } = await req.json();
  await connectDB();

  const user = await User.findOne({
    $or: [{ email: emailOrId }, { patientId: emailOrId }],
    role: "patient",
  });

  if (!user) {
    return NextResponse.json({ error: "Patient not found" }, { status: 404 });
  }

  const otp = generateOTP();

  user.otpCode = otp;
  user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000); 
  await user.save();

  console.log("OTP (dev only):", otp); 

  return NextResponse.json({ success: true });
}
