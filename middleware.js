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
import { verifyToken } from "@/lib/jwt";

export function middleware(req) {
  // ✅ ONLY correct way in middleware
  const token = req.cookies.get("token")?.value;
  const path = req.nextUrl.pathname;

  // Not logged in → redirect
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const user = verifyToken(token);

    // Role protection
    if (path.startsWith("/dashboard/admin") && user.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (path.startsWith("/dashboard/doctor") && user.role !== "doctor") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (path.startsWith("/dashboard/patient") && user.role !== "patient") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};