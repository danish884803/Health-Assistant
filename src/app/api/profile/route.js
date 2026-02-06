import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  await connectDB();

  const cookieStore = await cookies(); 
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const decoded = verifyToken(token);

  const user = await User.findById(decoded.id).select("-passwordHash");
  if (!user) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ user });
}


export async function PUT(req) {
  await connectDB();

  const cookieStore = await cookies(); 
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const decoded = verifyToken(token);
  const body = await req.json();

  const updated = await User.findByIdAndUpdate(
    decoded.id,
    {
      fullName: body.fullName,
      phone: body.phone,
      dob: body.dob,
      gender: body.gender,
      bloodGroup: body.bloodGroup,
      heightCm: body.heightCm,
      weightKg: body.weightKg,
      allergies: body.allergies,
      chronicConditions: body.chronicConditions,
      emergencyContactName: body.emergencyContactName,
      emergencyContactPhone: body.emergencyContactPhone,
    },
    { new: true }
  ).select("-passwordHash");

  return NextResponse.json({
    success: true,
    user: updated,
  });
}
