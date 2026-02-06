import { NextResponse } from "next/server";
import Doctor from "@/models/Doctor";
import Appointment from "@/models/Appointment";
import { connectDB } from "@/lib/mongodb";

function generateSlots(start, end, duration) {
  const slots = [];
  let [h, m] = start.split(":").map(Number);
  let [eh, em] = end.split(":").map(Number);

  let current = h * 60 + m;
  const endMinutes = eh * 60 + em;

  while (current + duration <= endMinutes) {
    const hour = String(Math.floor(current / 60)).padStart(2, "0");
    const min = String(current % 60).padStart(2, "0");
    slots.push(`${hour}:${min}`);
    current += duration;
  }

  return slots;
}

export async function GET(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const doctorId = searchParams.get("doctorId");
  const date = searchParams.get("date");

  if (!doctorId || !date) {
    return NextResponse.json({ slots: [] });
  }

  const doctor = await Doctor.findById(doctorId);
  if (!doctor) return NextResponse.json({ slots: [] });

  // Day check
  const dayName = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
  });

  if (!doctor.availability.days.includes(dayName)) {
    return NextResponse.json({ slots: [] });
  }

  const allSlots = generateSlots(
    doctor.availability.startTime,
    doctor.availability.endTime,
    doctor.availability.slotDuration
  );

  const booked = await Appointment.find({
    doctorId,
    date: new Date(date),
    status: { $ne: "cancelled" },
  });

  const bookedTimes = booked.map((a) => a.time);

  const availableSlots = allSlots.filter(
    (t) => !bookedTimes.includes(t)
  );

  return NextResponse.json({ slots: availableSlots });
}
