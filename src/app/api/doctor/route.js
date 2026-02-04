import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Doctor from "@/models/Doctor";
import HospitalRoom from "@/models/HospitalRoom"; // ✅ REQUIRED FOR populate

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const department = searchParams.get("department");

    if (!department) {
      return NextResponse.json({ doctors: [] });
    }

    const doctors = await Doctor
      .find({ department })
      .select(
        "_id name email department clinic room roomId availability"
      )
      .populate({
        path: "roomId",
        select: "name roomCode floorId",
      });

    return NextResponse.json({ doctors });
  } catch (err) {
    console.error("DOCTOR FETCH ERROR:", err);
    return NextResponse.json({ doctors: [] }, { status: 500 });
  }
}
