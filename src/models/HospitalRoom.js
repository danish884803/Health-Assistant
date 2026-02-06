import mongoose from "mongoose";

const HospitalRoomSchema = new mongoose.Schema({
  name: String,               
  roomCode: String,         
  type: {
    type: String,
    enum: ["department", "service", "facility"]
  },
  icon: String,              
  gridArea: String,          
  floorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HospitalFloor"
  }
});

export default mongoose.models.HospitalRoom ||
  mongoose.model("HospitalRoom", HospitalRoomSchema);
