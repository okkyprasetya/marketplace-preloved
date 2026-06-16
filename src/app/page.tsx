import Link from "next/link";
import { auth } from "@/auth";

export default async function HomePage() {
  const session = await auth();

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <section className="grid gap-8 rounded-lg border border-gray-200 bg-white p-8 shadow-sm md:grid-cols-[1.3fr_0.7fr]">
        <div>
          <h1 className="mt-3 text-4xl font-bold text-gray-950">
            Lapak barang second
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600">
            Temukan berbagai macam barang second berkualitas di Lapak Barang Second! Harga minimal kualitas maksimal. Jelajahi katalog kami dan temukan penawaran terbaik untuk kebutuhanmu. Mulai belanja sekarang dan dapatkan barang second impianmu dengan harga terjangkau!  
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              className="rounded-md bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-700"
              href="/products"
            >
              Browse products
            </Link>
            <Link
              className="rounded-md border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:border-gray-400 hover:bg-gray-50"
              href={session?.user ? "/products" : "/register"}
            >
              {session?.user ? "View catalog" : "Create account"}
            </Link>
          </div>
        </div>
        <aside className="rounded-md bg-gray-50 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Current session
          </h2>
          {session?.user ? (
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="font-medium text-gray-500">Name</dt>
                <dd className="mt-1 font-semibold text-gray-950">{session.user.name}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Email</dt>
                <dd className="mt-1 font-semibold text-gray-950">{session.user.email}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Role</dt>
                <dd className="mt-1 font-semibold capitalize text-gray-950">{session.user.role}</dd>
              </div>
            </dl>
          ) : (
            <p className="mt-4 text-sm leading-6 text-gray-600">
              No active session. Register or login to verify persisted authentication.
            </p>
          )}
        </aside>
      </section>
    </main>
  );
}
