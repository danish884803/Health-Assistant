'use client';

import { useParams } from "next/navigation";

export default function ReportPage() {

  const { id } = useParams();

  const pdfUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/api/appointments/${id}/summary/pdf`;

  return (
    <div className="min-h-screen bg-slate-50 p-4">

      <iframe
        src={`https://docs.google.com/gview?embedded=1&url=${pdfUrl}`}
        className="w-full h-[95vh] border rounded-xl"
      />

    </div>
  );
}