import mongoose from "mongoose";

const HospitalFloorSchema = new mongoose.Schema({
  name: String,        
  level: Number        
});

export default mongoose.models.HospitalFloor ||
  mongoose.model("HospitalFloor", HospitalFloorSchema);
