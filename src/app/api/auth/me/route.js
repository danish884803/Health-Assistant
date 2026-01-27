// import { NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import { verifyToken } from "@/lib/jwt";

// export async function GET() {
//   try {
//     const cookieStore = await cookies();
//     const token = cookieStore.get("token")?.value;

//     if (!token) {
//       return NextResponse.json({ user: null });
//     }

//     const decoded = verifyToken(token);

//     return NextResponse.json({
//       user: {
//         id: decoded.id,
//         email: decoded.email,
//         fullName: decoded.fullName,
//         role: decoded.role,
//         patientId: decoded.patientId,
//       },
//     });
//   } catch (e) {
//     console.error("ME ERROR:", e);
//     return NextResponse.json({ user: null });
//   }
// }
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ user: null });
    }

    const decoded = verifyToken(token);

    return NextResponse.json({
      user: {
        id: decoded.id,        // ✅ REQUIRED
        name: decoded.name,    // ✅ REQUIRED
        email: decoded.email,
        role: decoded.role,
      },
    });
  } catch (err) {
    console.error("AUTH ME ERROR:", err);
    return NextResponse.json({ user: null });
  }
}
