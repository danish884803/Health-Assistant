import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { signJwt } from "@/lib/jwt";

export async function POST(req) {
  try {
    const { email, password, role } = await req.json();
    await connectDB();

    const user = await User.findOne({ email, role });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    if (!user.emailVerified) {
      return NextResponse.json({ error: "Email not verified" }, { status: 403 });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // ✅ SIGN JWT
    const token = signJwt(user);

    const res = NextResponse.json({
      success: true,
      role: user.role,
    });

    // 🔴 CRITICAL PART
    res.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,          // ✅ MUST be false on localhost
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (e) {
    console.error("LOGIN ERROR:", e);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
