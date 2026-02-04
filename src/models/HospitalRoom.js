import mongoose from "mongoose";

const HospitalRoomSchema = new mongoose.Schema({
  name: String,               // Cardiology
  roomCode: String,           // 302
  type: {
    type: String,
    enum: ["department", "service", "facility"]
  },
  icon: String,               // "Heart", "Stethoscope"
  gridArea: String,           // "1 / 1 / 2 / 3"
  floorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HospitalFloor"
  }
});

export default mongoose.models.HospitalRoom ||
  mongoose.model("HospitalRoom", HospitalRoomSchema);
