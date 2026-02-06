// import { NextResponse } from "next/server";
// import { verifyToken } from "@/lib/jwt";

// export function middleware(req) {
//   const token = req.cookies.get("token")?.value; 
//   const path = req.nextUrl.pathname;

//   if (!token && path.startsWith("/dashboard")) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   if (token) {
//     try {
//       const user = verifyToken(token);

//       if (path.startsWith("/dashboard/admin") && user.role !== "admin") {
//         return NextResponse.redirect(new URL("/", req.url));
//       }

//       if (path.startsWith("/dashboard/doctor") && user.role !== "doctor") {
//         return NextResponse.redirect(new URL("/", req.url));
//       }

//       if (path.startsWith("/dashboard/patient") && user.role !== "patient") {
//         return NextResponse.redirect(new URL("/", req.url));
//       }

//     } catch {
//       return NextResponse.redirect(new URL("/login", req.url));
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/dashboard/:path*"],
// };
import { NextResponse } from "next/server";

/**
 * Decode JWT payload safely (no verification)
 * Works in Edge + Node
 */
function decodeJwt(token) {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(base64);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const path = req.nextUrl.pathname;

  // 🔒 Not logged in → block dashboard
  if (!token && path.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (token) {
    const user = decodeJwt(token);

    // Invalid token format
    if (!user) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // 🔐 Role-based access
    if (path.startsWith("/dashboard/admin") && user.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (path.startsWith("/dashboard/doctor") && user.role !== "doctor") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (path.startsWith("/dashboard/patient") && user.role !== "patient") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};