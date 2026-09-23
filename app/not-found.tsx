import Link from "next/link";

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-momentum-dark text-white pt-20">
      <div className="text-center px-4">
        <p className="text-momentum-orange-on-dark font-semibold uppercase tracking-widest mb-3">
          404
        </p>
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Out of court</h1>
        <p className="text-xl text-gray-300 mb-8">That page does not exist. Try one of these.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/" className="bg-momentum-orange px-6 py-3 rounded-lg font-semibold">
            Home
          </Link>
          <Link
            href="/book"
            className="bg-white/10 border border-white/20 px-6 py-3 rounded-lg font-semibold"
          >
            Book
          </Link>
          <Link
            href="/#contact"
            className="bg-white/10 border border-white/20 px-6 py-3 rounded-lg font-semibold"
          >
            Contact
          </Link>
        </div>
      </div>
    </section>
  );
}
