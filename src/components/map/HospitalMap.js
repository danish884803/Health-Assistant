// 'use client';

// import { useState } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import {
//   DoorOpen,
//   Heart,
//   Stethoscope,
//   Building2,
//   Coffee,
//   Car,
//   Brain,
//   Bone,
//   Baby,
//   Users,
//   Sparkles,
// } from "lucide-react";

// /* ---------------- FLOORS DATA ---------------- */

// const floors = [
//   {
//     id: 0,
//     name: "Ground Floor",
//     rooms: [
//       { id: "reception", name: "Main Reception", type: "service", icon: DoorOpen, gridArea: "1 / 1 / 2 / 3" },
//       { id: "emergency", name: "Emergency", type: "department", icon: Heart, gridArea: "1 / 3 / 2 / 5" },
//       { id: "pharmacy", name: "Pharmacy", type: "service", icon: Stethoscope, gridArea: "2 / 1 / 3 / 2" },
//       { id: "laboratory", name: "Laboratory", type: "service", icon: Building2, gridArea: "2 / 2 / 3 / 3" },
//       { id: "cafeteria", name: "Cafeteria", type: "facility", icon: Coffee, gridArea: "2 / 3 / 3 / 4" },
//       { id: "parking", name: "Parking", type: "facility", icon: Car, gridArea: "2 / 4 / 3 / 5" },
//     ],
//   },
//   {
//     id: 1,
//     name: "First Floor",
//     rooms: [
//       { id: "cardiology", name: "Cardiology", type: "department", icon: Heart, gridArea: "1 / 1 / 2 / 3" },
//       { id: "neurology", name: "Neurology", type: "department", icon: Brain, gridArea: "1 / 3 / 2 / 5" },
//       { id: "orthopedics", name: "Orthopedics", type: "department", icon: Bone, gridArea: "2 / 1 / 3 / 3" },
//       { id: "radiology", name: "Radiology", type: "service", icon: Building2, gridArea: "2 / 3 / 3 / 5" },
//     ],
//   },
//   {
//     id: 2,
//     name: "Second Floor",
//     rooms: [
//       { id: "pediatrics", name: "Pediatrics", type: "department", icon: Baby, gridArea: "1 / 1 / 2 / 3" },
//       { id: "gynecology", name: "Gynecology", type: "department", icon: Users, gridArea: "1 / 3 / 2 / 5" },
//       { id: "dermatology", name: "Dermatology", type: "department", icon: Sparkles, gridArea: "2 / 1 / 3 / 3" },
//       { id: "dental", name: "Dental Clinic", type: "department", icon: Stethoscope, gridArea: "2 / 3 / 3 / 5" },
//     ],
//   },
// ];

// /* ---------------- COMPONENT ---------------- */

// export default function HospitalMap() {
//   const [selectedFloor, setSelectedFloor] = useState(0);
//   const [selectedRoom, setSelectedRoom] = useState(null);

//   const searchParams = useSearchParams();
//   const router = useRouter();

//   // 🔥 Detect where user came from
//   const from = searchParams.get("from");

//   const backPath = from === "dashboard" ? "/dashboard/patient" : "/";
//   const backLabel = from === "dashboard" ? "← Back to Dashboard" : "← Back to Home";

//   const currentFloor = floors[selectedFloor];
//   const activeRoom = currentFloor.rooms.find(r => r.id === selectedRoom);

//   const getRoomStyle = (type, active) => {
//     if (active)
//       return "bg-teal-600 text-white shadow-[0_12px_32px_rgba(16,185,129,0.35)]";

//     switch (type) {
//       case "department":
//         return "bg-teal-50 text-teal-700 hover:bg-teal-100";
//       case "service":
//         return "bg-sky-50 text-sky-700 hover:bg-sky-100";
//       case "facility":
//         return "bg-amber-50 text-amber-700 hover:bg-amber-100";
//       default:
//         return "bg-gray-100";
//     }
//   };

//   return (
//     <section className="max-w-7xl mx-auto px-6 py-20">
      
//       {/* HEADER */}
//       <div className="mb-8">
//         <button
//           onClick={() => router.push(backPath)}
//           className="text-sm text-gray-500 hover:text-gray-800"
//         >
//           {backLabel}
//         </button>

//         <h1 className="text-3xl font-bold text-gray-900 mt-2">
//           Hospital Map
//         </h1>

//         <p className="text-gray-500">
//           Navigate through our hospital facilities
//         </p>
//       </div>

//       {/* FLOOR TABS */}
//       <div className="flex gap-3 mb-8">
//         {floors.map(floor => (
//           <button
//             key={floor.id}
//             onClick={() => {
//               setSelectedFloor(floor.id);
//               setSelectedRoom(null);
//             }}
//             className={`px-6 py-2 rounded-full text-sm font-medium transition
//               ${selectedFloor === floor.id
//                 ? "bg-teal-600 text-white shadow"
//                 : "border border-teal-500 text-teal-600 hover:bg-teal-50"}`}
//           >
//             {floor.name}
//           </button>
//         ))}
//       </div>

//       {/* LAYOUT */}
//       <div className="grid lg:grid-cols-[1fr_320px] gap-10">
        
//         {/* MAP */}
//         <div className="bg-white rounded-3xl border shadow-sm p-6">
//           <h2 className="font-semibold text-lg mb-4">
//             {currentFloor.name}
//           </h2>

//           <div
//             className="grid gap-4"
//             style={{
//               gridTemplateColumns: "repeat(4, 1fr)",
//               gridTemplateRows: "repeat(2, 120px)",
//             }}
//           >
//             {currentFloor.rooms.map(room => {
//               const Icon = room.icon;
//               const active = selectedRoom === room.id;

//               return (
//                 <button
//                   key={room.id}
//                   onClick={() => setSelectedRoom(room.id)}
//                   style={{ gridArea: room.gridArea }}
//                   className={`rounded-2xl flex flex-col items-center justify-center gap-2 transition-all duration-200 ${getRoomStyle(room.type, active)}`}
//                 >
//                   <Icon className="w-8 h-8" />
//                   <span className="text-sm font-medium text-center">
//                     {room.name}
//                   </span>
//                 </button>
//               );
//             })}
//           </div>

//           {/* LEGEND */}
//           <div className="mt-6 flex gap-6 text-sm text-gray-500">
//             <div className="flex items-center gap-2">
//               <span className="w-3 h-3 rounded bg-teal-200" /> Departments
//             </div>
//             <div className="flex items-center gap-2">
//               <span className="w-3 h-3 rounded bg-sky-200" /> Services
//             </div>
//             <div className="flex items-center gap-2">
//               <span className="w-3 h-3 rounded bg-amber-200" /> Facilities
//             </div>
//           </div>
//         </div>

//         {/* ROOM DETAILS */}
//         <div className="bg-white rounded-3xl border shadow-sm p-6">
//           <h2 className="font-semibold text-lg mb-4">Room Details</h2>

//           {activeRoom ? (
//             <>
//               <div className="w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center mb-4">
//                 <activeRoom.icon className="w-8 h-8 text-teal-600" />
//               </div>

//               <h3 className="text-xl font-semibold">
//                 {activeRoom.name}
//               </h3>

//               <p className="text-sm text-gray-500 mt-1">
//                 {currentFloor.name} • Room {activeRoom.id.toUpperCase()}
//               </p>

//               <p className="mt-3 text-sm">
//                 <span className="text-gray-500">Type:</span>{" "}
//                 <span className="capitalize">{activeRoom.type}</span>
//               </p>

//               <p className="text-sm mt-1">
//                 <span className="text-gray-500">Status:</span>{" "}
//                 <span className="text-emerald-600 font-medium">Open</span>
//               </p>
//             </>
//           ) : (
//             <p className="text-gray-500 text-sm">
//               Select a room on the map to view details
//             </p>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// }
// 'use client';

// import { useEffect, useState, Suspense } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import {
//   DoorOpen, Heart, Stethoscope, Building2,
//   Coffee, Car, Brain, Bone, Baby, Users, Sparkles,MapPin
// } from "lucide-react";

// const ICONS = {
//   department: Heart,
//   service: Building2,
//   facility: Coffee,
// };

// // Internal component to handle search params
// function MapContent() {
//   const [floors, setFloors] = useState([]);
//   const [rooms, setRooms] = useState([]);
//   const [selectedFloor, setSelectedFloor] = useState(null);
//   const [selectedRoom, setSelectedRoom] = useState(null);

//   const searchParams = useSearchParams();
//   const router = useRouter();

//   const roomFromQuery = searchParams.get("room");
//   const from = searchParams.get("from");
//   const backPath = from === "dashboard" ? "/dashboard/patient" : "/";

//   useEffect(() => {
//     async function loadMapData() {
//       try {
//         const res = await fetch("/api/map");
//         const data = await res.json();
        
//         const allFloors = data.floors || [];
//         const allRooms = data.rooms || [];
        
//         setFloors(allFloors);
//         setRooms(allRooms);

//         // ✅ FIXED LOGIC: Use the data directly from the fetch, not the state
//         if (roomFromQuery) {
//           const room = allRooms.find(r => r._id === roomFromQuery);
//           if (room) {
//             // Check if floorId is an object (populated) or just a string
//             const fId = typeof room.floorId === 'object' ? room.floorId._id : room.floorId;
//             setSelectedFloor(fId);
//             setSelectedRoom(room._id);
//           }
//         } else if (allFloors.length > 0) {
//           setSelectedFloor(allFloors[0]._id);
//         }
//       } catch (err) {
//         console.error("Failed to load map data:", err);
//       }
//     }

//     loadMapData();
//   }, [roomFromQuery]); // Dependency array ensures it re-runs if URL changes

//   const currentFloor = floors.find(f => f._id === selectedFloor);
//   const floorRooms = rooms.filter(r => {
//      const rFloorId = typeof r.floorId === 'object' ? r.floorId._id : r.floorId;
//      return rFloorId === selectedFloor;
//   });
//   const activeRoom = rooms.find(r => r._id === selectedRoom);

//   const getRoomStyle = (type, active) => {
//     if (active) return "bg-teal-600 text-white shadow-[0_12px_32px_rgba(16,185,129,0.35)] scale-105 z-10";
//     switch (type) {
//       case "department": return "bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-100";
//       case "service": return "bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-100";
//       case "facility": return "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-100";
//       default: return "bg-gray-100";
//     }
//   };

//   return (
//     <section className="max-w-7xl mx-auto px-6 py-20">
//       <button onClick={() => router.push(backPath)} className="text-sm text-gray-500 hover:text-gray-800 mb-4 flex items-center gap-1">
//         ← Back to {from === "dashboard" ? "Dashboard" : "Home"}
//       </button>

//       <h1 className="text-3xl font-bold mb-6">Hospital Map Explorer</h1>

//       {/* FLOOR SELECTOR */}
//       <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
//         {floors.map(f => (
//           <button
//             key={f._id}
//             onClick={() => {
//               setSelectedFloor(f._id);
//               setSelectedRoom(null);
//             }}
//             className={`px-6 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all
//               ${selectedFloor === f._id ? "bg-teal-600 text-white shadow-md" : "bg-white border border-gray-200 text-gray-600 hover:border-teal-500"}`}
//           >
//             {f.name}
//           </button>
//         ))}
//       </div>

//       <div className="grid lg:grid-cols-[1fr_320px] gap-10">
//         {/* MAP GRID */}
//         <div className="bg-slate-50 rounded-3xl border p-8 min-h-[400px]">
//           <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(4, 1fr)", gridTemplateRows: "repeat(2, 140px)" }}>
//             {floorRooms.map(room => {
//               const Icon = ICONS[room.type] || DoorOpen;
//               const active = selectedRoom === room._id;
//               return (
//                 <button
//                   key={room._id}
//                   onClick={() => setSelectedRoom(room._id)}
//                   style={{ gridArea: room.gridArea }}
//                   className={`rounded-2xl flex flex-col items-center justify-center gap-3 transition-all duration-300 ${getRoomStyle(room.type, active)}`}
//                 >
//                   <Icon className={`${active ? "text-white" : ""} w-8 h-8`} />
//                   <span className="text-xs font-bold uppercase tracking-tight text-center px-2 leading-tight">
//                     {room.name}
//                   </span>
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         {/* SIDEBAR DETAILS */}
//         <div className="space-y-6">
//           <div className="bg-white rounded-3xl border p-6 shadow-sm">
//             <h2 className="font-bold text-gray-400 text-xs uppercase tracking-widest mb-4">Location Details</h2>
//             {activeRoom ? (
//               <div className="animate-in fade-in slide-in-from-bottom-2">
//                 <h3 className="text-2xl font-bold text-gray-900">{activeRoom.name}</h3>
//                 <p className="text-teal-600 font-medium flex items-center gap-2 mt-1">
//                    <Building2 size={16}/> {currentFloor?.name}
//                 </p>
//                 <div className="mt-6 pt-6 border-t border-gray-100">
//                    <p className="text-sm text-gray-500 mb-1">Room Code</p>
//                    <p className="font-mono font-bold text-lg">{activeRoom.roomCode || 'N/A'}</p>
//                 </div>
//                 <div className="mt-4">
//                    <p className="text-sm text-gray-500 mb-1">Category</p>
//                    <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-bold capitalize">
//                      {activeRoom.type}
//                    </span>
//                 </div>
//               </div>
//             ) : (
//               <div className="text-center py-10">
//                 <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
//                    <MapPin className="text-gray-300" />
//                 </div>
//                 <p className="text-gray-400 text-sm">Select a room to view its details</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// // ✅ Main export must be wrapped in Suspense for useSearchParams()
// export default function HospitalMap() {
//   return (
//     <Suspense fallback={<div className="p-20 text-center">Loading Map...</div>}>
//       <MapContent />
//     </Suspense>
//   );
// }
'use client';

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  DoorOpen,
  Heart,
  Building2,
  Coffee,
  MapPin,
} from "lucide-react";

/* =========================
   ICON MAPPING
========================= */
const ICONS = {
  department: Heart,
  service: Building2,
  facility: Coffee,
};

/* =========================
   MAP CONTENT
========================= */
function MapContent() {
  const [floors, setFloors] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  // 🔑 Can be roomId (old dashboard) OR roomCode (chatbot)
  const roomParam = searchParams.get("room");
  const from = searchParams.get("from");
  const backPath = from === "dashboard" ? "/dashboard/patient" : "/";

  /* =========================
     LOAD MAP DATA
  ========================= */
  useEffect(() => {
    async function loadMapData() {
      try {
        const res = await fetch("/api/map");
        const data = await res.json();

        const allFloors = data.floors || [];
        const allRooms = data.rooms || [];

        setFloors(allFloors);
        setRooms(allRooms);

        /* ✅ UNIVERSAL ROOM RESOLUTION
           - supports roomId (old)
           - supports roomCode (AI/chatbot)
        */
        if (roomParam) {
          const matchedRoom = allRooms.find(
            r =>
              r._id === roomParam ||        // old dashboard
              r.roomCode === roomParam      // chatbot / AI
          );

          if (matchedRoom) {
            const floorId =
              typeof matchedRoom.floorId === "object"
                ? matchedRoom.floorId._id
                : matchedRoom.floorId;

            setSelectedFloor(floorId);
            setSelectedRoomId(matchedRoom._id);
            return;
          }
        }

        // Default → first floor
        if (allFloors.length > 0) {
          setSelectedFloor(allFloors[0]._id);
        }
      } catch (err) {
        console.error("Failed to load map data:", err);
      }
    }

    loadMapData();
  }, [roomParam]);

  /* =========================
     DERIVED DATA
  ========================= */
  const currentFloor = floors.find(f => f._id === selectedFloor);

  const floorRooms = rooms.filter(r => {
    const fId =
      typeof r.floorId === "object" ? r.floorId._id : r.floorId;
    return fId === selectedFloor;
  });

  const activeRoom = rooms.find(r => r._id === selectedRoomId);

  const getRoomStyle = (type, active) => {
    if (active)
      return "bg-teal-600 text-white scale-105 shadow-xl z-10";

    switch (type) {
      case "department":
        return "bg-teal-50 text-teal-700 hover:bg-teal-100";
      case "service":
        return "bg-sky-50 text-sky-700 hover:bg-sky-100";
      case "facility":
        return "bg-amber-50 text-amber-700 hover:bg-amber-100";
      default:
        return "bg-gray-100";
    }
  };

  /* =========================
     UI
  ========================= */
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">

      {/* BACK */}
      <button
        onClick={() => router.push(backPath)}
        className="text-sm text-gray-500 hover:text-gray-800 mb-4"
      >
        ← Back to {from === "dashboard" ? "Dashboard" : "Home"}
      </button>

      <h1 className="text-3xl font-bold mb-6">Hospital Map Explorer</h1>

      {/* FLOORS */}
      <div className="flex gap-3 mb-8 overflow-x-auto">
        {floors.map(f => (
          <button
            key={f._id}
            onClick={() => {
              setSelectedFloor(f._id);
              setSelectedRoomId(null);
            }}
            className={`px-6 py-2 rounded-full text-sm font-semibold whitespace-nowrap
              ${
                selectedFloor === f._id
                  ? "bg-teal-600 text-white shadow-md"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-teal-500"
              }`}
          >
            {f.name}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-10">

        {/* MAP GRID */}
        <div className="bg-slate-50 rounded-3xl border p-8">
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: "repeat(4, 1fr)",
              gridTemplateRows: "repeat(2, 140px)",
            }}
          >
            {floorRooms.map(room => {
              const Icon = ICONS[room.type] || DoorOpen;
              const active = selectedRoomId === room._id;

              return (
                <button
                  key={room._id}
                  onClick={() => setSelectedRoomId(room._id)}
                  style={{ gridArea: room.gridArea }}
                  className={`rounded-2xl flex flex-col items-center justify-center gap-3 transition-all duration-300 ${getRoomStyle(
                    room.type,
                    active
                  )}`}
                >
                  <Icon className={active ? "text-white" : ""} size={28} />
                  <span className="text-xs font-bold uppercase text-center px-2">
                    {room.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* DETAILS */}
        <div className="bg-white rounded-3xl border p-6">
          {!activeRoom ? (
            <div className="text-center py-20 text-gray-400">
              <MapPin className="mx-auto mb-4" />
              Select a room to view details
            </div>
          ) : (
            <>
              <h3 className="text-2xl font-bold">{activeRoom.name}</h3>
              <p className="text-teal-600 mt-1">
                {currentFloor?.name}
              </p>

              <div className="mt-6 text-sm text-gray-500">
                Room Code
              </div>
              <div className="font-mono font-bold text-lg">
                {activeRoom.roomCode || "N/A"}
              </div>

              <div className="mt-4">
                <span className="inline-block px-3 py-1 rounded-full bg-gray-100 text-xs font-bold capitalize">
                  {activeRoom.type}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

/* =========================
   EXPORT (Suspense)
========================= */
export default function HospitalMap() {
  return (
    <Suspense fallback={<div className="p-20 text-center">Loading map…</div>}>
      <MapContent />
    </Suspense>
  );
}
