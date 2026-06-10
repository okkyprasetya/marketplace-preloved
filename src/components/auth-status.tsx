import Link from "next/link";
import { auth, signOut } from "@/auth";

export async function AuthStatus() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="flex items-center gap-3">
        <Link className="text-sm font-medium text-gray-700 hover:text-gray-950" href="/login">
          Login
        </Link>
        <Link
          className="rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-700"
          href="/register"
        >
          Register
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="text-right">
        <p className="text-sm font-semibold text-gray-950">{session.user.name}</p>
        <p className="text-xs uppercase tracking-wide text-gray-500">{session.user.role}</p>
      </div>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
      >
        <button
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-gray-400 hover:bg-white"
          type="submit"
        >
          Logout
        </button>
      </form>
    </div>
  );
}
