import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminClient from "./AdminClient";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user as any)?.role !== "admin") {
    redirect("/giris");
  }

  return <AdminClient />;
}