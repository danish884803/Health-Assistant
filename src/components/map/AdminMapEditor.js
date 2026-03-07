'use client';

import { useEffect, useState } from "react";

export default function AdminMapEditor() {

  const [floors, setFloors] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [activeFloor, setActiveFloor] = useState(null);
  const [dragRoom, setDragRoom] = useState(null);

  /* =========================
      LOAD FLOORS + ROOMS
  ========================= */

  useEffect(() => {

    Promise.all([
      fetch('/api/admin/floors', { credentials: 'include' }).then(r => r.json()),
      fetch('/api/admin/rooms', { credentials: 'include' }).then(r => r.json()),
    ])

      .then(([f, r]) => {

        setFloors(f.floors || []);
        setRooms(r.rooms || []);

        if (f.floors?.length)
          setActiveFloor(f.floors[0]._id);

      });

  }, []);

  /* =========================
      FILTER FLOOR ROOMS
  ========================= */

  const floorRooms = rooms.filter(
    r => r.floorId?._id === activeFloor
  );

  /* =========================
      DRAG DROP
  ========================= */

  async function onDrop(room, cell) {

    await fetch('/api/admin/rooms', {

      method: 'PUT',

      headers: { 'Content-Type': 'application/json' },

      credentials: 'include',

      body: JSON.stringify({
        roomId: room._id,
        gridArea: cell
      }),

    });

    setRooms(prev =>
      prev.map(r =>
        r._id === room._id
          ? { ...r, gridArea: cell }
          : r
      )
    );
  }

  return (

    <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">

      {/* FLOORS PANEL */}

      <div className="bg-white rounded-2xl border p-4">

        <h3 className="font-bold mb-3">
          Floors
        </h3>

        <div className="flex lg:flex-col gap-2 overflow-x-auto">

          {floors.map(f => (

            <button
              key={f._id}
              onClick={() => setActiveFloor(f._id)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap
              ${
                activeFloor === f._id
                  ? 'bg-teal-600 text-white'
                  : 'hover:bg-slate-100'
              }`}
            >

              {f.name}

            </button>

          ))}

        </div>

      </div>

      {/* MAP GRID EDITOR */}

      <div className="bg-white rounded-3xl border p-4 sm:p-6">

        <h3 className="font-bold mb-4">
          2D Layout Editor
        </h3>

        {/* Scroll wrapper for mobile */}

        <div className="overflow-x-auto">

          <div
            className="grid gap-4 border rounded-xl p-4 min-w-[420px]"
            style={{
              gridTemplateColumns: "repeat(4, 1fr)",
              gridTemplateRows: "repeat(2, 120px)",
            }}
          >

            {[
              "1 / 1 / 2 / 3",
              "1 / 3 / 2 / 5",
              "2 / 1 / 3 / 3",
              "2 / 3 / 3 / 5"
            ].map(cell => (

              <div
                key={cell}
                className="border-2 border-dashed rounded-xl flex items-center justify-center relative"
              >

                {floorRooms.map(room =>

                  room.gridArea === cell && (

                    <div
                      key={room._id}

                      draggable

                      onDragStart={() => setDragRoom(room)}

                      onDragEnd={() => onDrop(room, cell)}

                      className="w-full h-full bg-teal-100 rounded-xl flex items-center justify-center font-bold cursor-move text-sm text-center px-2"
                    >

                      {room.name}

                    </div>

                  )
                )}

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>

  );
}