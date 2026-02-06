// 'use client';

// import { useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";

// export default function VerifyEmailPage() {
//   const router = useRouter();
//   const params = useSearchParams();
//   const email = params.get("email");

//   const [otp, setOtp] = useState("");
//   const [error, setError] = useState("");

//   const verify = async () => {
//     const res = await fetch("/api/auth/verify-email", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, otp }),
//     });

//     if (res.ok) {
//       router.push("/dashboard/patient");
//     } else {
//       const data = await res.json();
//       setError(data.error);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center">
//       <div className="bg-white p-6 rounded-xl shadow w-96">
//         <h1 className="text-xl font-bold mb-4">Verify Email</h1>
//         <input
//           value={otp}
//           onChange={e => setOtp(e.target.value)}
//           placeholder="Enter 6 digit OTP"
//           className="w-full border p-3 rounded mb-3"
//         />
//         {error && <p className="text-red-500 text-sm">{error}</p>}
//         <button onClick={verify} className="w-full bg-teal-500 text-white p-3 rounded">
//           Verify & Continue
//         </button>
//       </div>
//     </div>
//   );
// }
'use client';

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function VerifyEmailContent() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email");

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const verify = async () => {
    const res = await fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    if (res.ok) {
      router.push("/dashboard/patient");
    } else {
      const data = await res.json();
      setError(data.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow w-96">
        <h1 className="text-xl font-bold mb-4">Verify Email</h1>
        <input
          value={otp}
          onChange={e => setOtp(e.target.value)}
          placeholder="Enter 6 digit OTP"
          className="w-full border p-3 rounded mb-3"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button onClick={verify} className="w-full bg-teal-500 text-white p-3 rounded">
          Verify & Continue
        </button>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl shadow w-96">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
            <div className="h-12 bg-gray-200 rounded mb-3"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}