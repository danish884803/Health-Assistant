'use client';

import { useParams } from "next/navigation";

export default function ReportPage() {

  const { id } = useParams();

  return (
    <div className="min-h-screen bg-slate-50 p-6">

      <iframe
        src={`/api/appointments/${id}/summary/pdf`}
        className="w-full h-[90vh] border rounded-xl"
      />

    </div>
  );
}