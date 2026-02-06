import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

import HospitalRoom from "@/models/HospitalRoom";
import HospitalFloor from "@/models/HospitalFloor";

export async function GET() {
  try {
    await connectDB();

    const rooms = await HospitalRoom
      .find()
      .populate("floorId", "name level");

    return NextResponse.json({ rooms });
  } catch (err) {
    console.error("ROOM GET ERROR", err);
    return NextResponse.json({ rooms: [] }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const room = await HospitalRoom.create(body);
    return NextResponse.json({ room });
  } catch (err) {
    console.error("ROOM CREATE ERROR", err);
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectDB();
    const body = await req.json();

    const room = await HospitalRoom.findByIdAndUpdate(
      body.roomId,
      { gridArea: body.gridArea },
      { new: true }
    ).populate("floorId", "name level");

    return NextResponse.json({ room });
  } catch (err) {
    console.error("ROOM UPDATE ERROR", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectDB();
    const { id } = await req.json();

    await HospitalRoom.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("ROOM DELETE ERROR", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
