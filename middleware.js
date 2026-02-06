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
  const token = req.cookies.get("token")?.value; 
  const path = req.nextUrl.pathname;

  // If accessing dashboard without token, redirect to login
  if (!token && path.startsWith("/dashboard")) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", path);
    return NextResponse.redirect(loginUrl);
  }

  // If token exists, verify and check role
  if (token) {
    try {
      const user = verifyToken(token);

      // Role-based access control
      if (path.startsWith("/dashboard/admin") && user.role !== "admin") {
        return NextResponse.redirect(new URL("/login", req.url));
      }

      if (path.startsWith("/dashboard/doctor") && user.role !== "doctor") {
        return NextResponse.redirect(new URL("/login", req.url));
      }

      if (path.startsWith("/dashboard/patient") && user.role !== "patient") {
        return NextResponse.redirect(new URL("/login", req.url));
      }

      // Token is valid, allow access
      const response = NextResponse.next();
      
      // Add user info to response headers (optional, for debugging)
      response.headers.set('x-user-role', user.role);
      response.headers.set('x-user-id', user.id);
      
      return response;

    } catch (error) {
      // Token is invalid, clear it and redirect to login
      const loginUrl = new URL("/login", req.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};