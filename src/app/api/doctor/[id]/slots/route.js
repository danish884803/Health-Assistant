// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/mongodb";
// import Doctor from "@/models/Doctor";
// import Appointment from "@/models/Appointment";

// function generateSlots(start, end, duration) {
//   const slots = [];
//   let [h, m] = start.split(":").map(Number);
//   const [eh, em] = end.split(":").map(Number);

//   let current = h * 60 + m;
//   const endMin = eh * 60 + em;

//   while (current + duration <= endMin) {
//     const hh = String(Math.floor(current / 60)).padStart(2, "0");
//     const mm = String(current % 60).padStart(2, "0");
//     slots.push(`${hh}:${mm}`);
//     current += duration;
//   }

//   return slots;
// }

// export async function GET(req, { params }) {
//   await connectDB();

//   const { searchParams } = new URL(req.url);
//   const date = searchParams.get("date");

//   const doctor = await Doctor.findById(params.id);
//   if (!doctor) {
//     return NextResponse.json({ slots: [] });
//   }

//   const day = new Date(date).toLocaleDateString("en-US", {
//     weekday: "long",
//   });

//   if (!doctor.availability.days.includes(day)) {
//     return NextResponse.json({ slots: [] });
//   }

//   const allSlots = generateSlots(
//     doctor.availability.startTime,
//     doctor.availability.endTime,
//     doctor.availability.slotDuration
//   );

//   const booked = await Appointment.find({
//     doctorName: doctor.name,
//     date,
//     status: { $ne: "cancelled" },
//   }).select("time");

//   const bookedTimes = booked.map(b => b.time);

//   const availableSlots = allSlots.filter(
//     slot => !bookedTimes.includes(slot)
//   );

//   return NextResponse.json({ slots: availableSlots });
// }
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Doctor from "@/models/Doctor";
import Appointment from "@/models/Appointment";
import mongoose from "mongoose";

/* =========================
   SLOT GENERATOR
========================= */
function generateSlots(start, end, duration) {
  const slots = [];
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);

  let current = sh * 60 + sm;
  const endMin = eh * 60 + em;

  while (current + duration <= endMin) {
    const h = String(Math.floor(current / 60)).padStart(2, "0");
    const m = String(current % 60).padStart(2, "0");
    slots.push(`${h}:${m}`);
    current += duration;
  }

  return slots;
}

/* =========================
   GET AVAILABLE SLOTS
========================= */
export async function GET(req, context) {
  try {
    await connectDB();

    // ✅ FIX — params IS ASYNC
    const { id } = await context.params;

    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get("date");

    if (!mongoose.Types.ObjectId.isValid(id) || !dateStr) {
      return NextResponse.json({ slots: [] });
    }

    // ✅ Normalize date (CRITICAL)
    const date = new Date(`${dateStr}T00:00:00`);

    const doctor = await Doctor.findById(id);
    if (!doctor || !doctor.availability) {
      return NextResponse.json({ slots: [] });
    }

    const weekday = date.toLocaleDateString("en-US", {
      weekday: "long",
    });

    if (!doctor.availability.days.includes(weekday)) {
      return NextResponse.json({ slots: [] });
    }

    const allSlots = generateSlots(
      doctor.availability.startTime,
      doctor.availability.endTime,
      doctor.availability.slotDuration
    );

    const booked = await Appointment.find({
      doctorId: doctor._id,
      date,
      status: { $ne: "cancelled" },
    }).select("time");

    const bookedTimes = booked.map(b => b.time);

    const availableSlots = allSlots.filter(
      slot => !bookedTimes.includes(slot)
    );

    return NextResponse.json({ slots: availableSlots });
  } catch (err) {
    console.error("SLOTS ERROR:", err);
    return NextResponse.json({ slots: [] });
  }
}
