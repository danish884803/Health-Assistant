import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";

export default function PatientLayout({ children }) {
  const token = cookies().get("token")?.value;

  let user;
  try {
    user = verifyToken(token);
  } catch {
    redirect("/login");
  }

 if (user.role !== "admin") redirect("/");

  return children;
}