'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ReportPage() {

  const { id } = useParams();
  const router = useRouter();

  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {

    async function loadPDF() {

      try {

        const res = await fetch(`/api/appointments/${id}/summary/pdf`, {
          credentials: "include"
        });

        const blob = await res.blob();

        const url = URL.createObjectURL(blob);

        setPdfUrl(url);

      } catch (err) {
        console.error("PDF load failed", err);
      }

    }

    loadPDF();

  }, [id]);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* HEADER */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <button
          onClick={() => router.back()}
          className="text-sm text-teal-600 font-semibold"
        >
          ← Back
        </button>

        <h2 className="font-bold text-gray-800">
          Medical Report
        </h2>

        <div />
      </div>

      {/* PDF VIEWER */}
      <div className="p-4">

        {!pdfUrl ? (
          <p className="text-center text-gray-500">
            Loading report...
          </p>
        ) : (
          <iframe
            src={pdfUrl}
            className="w-full h-[90vh] border rounded-xl"
          />
        )}

      </div>

    </div>
  );
}