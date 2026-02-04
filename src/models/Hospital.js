import mongoose from "mongoose";

const HospitalSchema = new mongoose.Schema({
  clinics: [
    {
      name: String,
      floors: [
        {
          floorNumber: Number,
          rooms: [String],
        },
      ],
    },
  ],
}, { timestamps: true });

export default mongoose.models.Hospital ||
  mongoose.model("Hospital", HospitalSchema);
