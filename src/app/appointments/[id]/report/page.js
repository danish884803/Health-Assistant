'use client';

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ReportPage() {

  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {

    const url = `/api/appointments/${id}/summary/pdf`;

    window.location.replace(url);

  }, [id]);

  return (
    <div className="min-h-screen flex items-center justify-center">

      <p className="text-gray-500">
        Opening medical report...
      </p>

      <button
        onClick={() => router.back()}
        className="absolute top-4 left-4 text-teal-600"
      >
        ← Back
      </button>

    </div>
  );
}