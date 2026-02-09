// import mongoose from "mongoose";

// const HospitalRoomSchema = new mongoose.Schema({
//   name: String,               
//   roomCode: String,         
//   type: {
//     type: String,
//     enum: ["department", "service", "facility"]
//   },
//   icon: String,              
//   gridArea: String,          
//   floorId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "HospitalFloor"
//   }
// });

// export default mongoose.models.HospitalRoom ||
//   mongoose.model("HospitalRoom", HospitalRoomSchema);
import mongoose from "mongoose";

const HospitalRoomSchema = new mongoose.Schema({
  name: String,
  roomCode: String,
  type: {
    type: String,
    enum: ["department", "service", "facility"],
  },
  icon: String,
  gridArea: String,
  floorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HospitalFloor",
  },

  navigation: {
    entryPoint: String,
    landmarks: [String],

    directionsFrom: {
      reception: [String],
      elevator: [String],
      stairs: [String],
      pharmacy: [String],
      radiology: [String],
      cafeteria: [String],
      parking: [String],
      emergency: [String],
      laboratory: [String],
      pediatrics: [String],
      gynecology: [String],
      dermatology: [String],
      dentalclinic: [String],
      orthopedics: [String],
      cardiology: [String],
      neurology: [String],

    },
  },
});

export default mongoose.models.HospitalRoom ||
  mongoose.model("HospitalRoom", HospitalRoomSchema);
