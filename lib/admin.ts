import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // or wherever your config is

export async function requireAdmin() {
  const session = await getServerSession(authOptions);

  console.log("SESSION:", session);  // 👈 ADD THIS

  if (!session?.user || !session.user.isAdmin) {
    throw new Error("Unauthorized");
  }

  return session;
}
