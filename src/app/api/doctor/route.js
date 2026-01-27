import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Doctor from "@/models/Doctor";


export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const department = searchParams.get("department");

    const query = {};

    if (department) {
      query.department = department;
    }

    const doctors = await Doctor.find(query).select(
      "_id name department clinic room availability"
    );

    return NextResponse.json({ doctors });
  } catch (err) {
    console.error("GET DOCTORS ERROR:", err);
    return NextResponse.json(
      { error: "Failed to load doctors" },
      { status: 500 }
    );
  }
}
