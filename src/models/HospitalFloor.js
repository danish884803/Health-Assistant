import mongoose from "mongoose";

const HospitalFloorSchema = new mongoose.Schema({
  name: String,        // Ground Floor, First Floor
  level: Number        // 0,1,2
});

export default mongoose.models.HospitalFloor ||
  mongoose.model("HospitalFloor", HospitalFloorSchema);
