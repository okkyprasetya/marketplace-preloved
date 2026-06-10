import { auth } from "@/auth";
import type { UserRole } from "@/models/user";

export type AuthorizedSession = {
  user: {
    id: string;
    role: UserRole;
    name?: string | null;
    email?: string | null;
  };
};

export async function requireRole(role: UserRole): Promise<AuthorizedSession | null> {
  const session = await auth();

  if (!session?.user || session.user.role !== role) {
    return null;
  }

  return {
    user: {
      id: session.user.id,
      role: session.user.role,
      name: session.user.name,
      email: session.user.email,
    },
  };
}
