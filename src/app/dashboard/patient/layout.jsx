import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { verifyToken } from "@/lib/jwt";

export default function PatientLayout({ children }) {
  const cookieHeader = headers().get("cookie");

  if (!cookieHeader) {
    redirect("/login");
  }

  // Extract token manually
  const token = cookieHeader
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];

  if (!token) {
    redirect("/login");
  }

  let user;
  try {
    user = verifyToken(token);
  } catch {
    redirect("/login");
  }

  if (user.role !== "patient") {
    redirect("/");
  }

  return children;
}