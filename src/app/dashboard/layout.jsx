import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";

export default function DashboardLayout({ children }) {
  const token = cookies().get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  let user;
  try {
    user = verifyToken(token);
  } catch {
    redirect("/login");
  }

  return children;
}