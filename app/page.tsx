import Link from "next/link";
export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#020617] to-black text-white">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center min-h-screen px-6">
        <h1 className="text-6xl font-bold tracking-tight">
          Nav<span className="text-blue-500">Cart</span>
        </h1>

        <p className="mt-6 text-lg text-gray-300 max-w-xl">
          A smarter way to shop. Navigate stores, manage your cart,
          and reach your items faster than ever.
        </p>

        <div className="mt-10 flex gap-6">
          <Link
            href="/products"
            className="px-8 py-3 bg-blue-600 rounded-xl hover:bg-blue-700 transition shadow-lg"
          >
            Start Shopping
          </Link>

          <a
            href="#features"
            className="px-8 py-3 border border-gray-500 rounded-xl hover:border-white transition"
          >
            See How It Works
          </a>
        </div>

        {/* Floating glow effect */}
        <div className="pointer-events-none absolute top-1/3 left-1/4 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl"></div>
<div className="pointer-events-none absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl"></div>

      </section>

      {/* Features Section */}
      {/* How It Works Section */}
<section
  id="features"
  className="py-28 px-12 grid grid-cols-1 md:grid-cols-3 gap-12 bg-black"
>
  <div className="p-10 rounded-2xl bg-[#020617] border border-gray-800 hover:border-blue-600 transition">
    <h3 className="text-2xl font-semibold text-blue-400">
      1️⃣ Select Your Products
    </h3>
    <p className="mt-5 text-gray-400 leading-relaxed">
      Browse through the store catalog and add items to your cart
      just like a normal shopping app.
    </p>
  </div>

  <div className="p-10 rounded-2xl bg-[#020617] border border-gray-800 hover:border-blue-600 transition">
    <h3 className="text-2xl font-semibold text-blue-400">
      2️⃣ Get Smart Navigation
    </h3>
    <p className="mt-5 text-gray-400 leading-relaxed">
      NavCart calculates the shortest route inside the store to help
      you collect all items faster and smarter.
    </p>
  </div>

  <div className="p-10 rounded-2xl bg-[#020617] border border-gray-800 hover:border-blue-600 transition">
    <h3 className="text-2xl font-semibold text-blue-400">
      3️⃣ Checkout Effortlessly
    </h3>
    <p className="mt-5 text-gray-400 leading-relaxed">
      Review your live cart, confirm your order, and checkout with
      zero confusion and zero time waste.
    </p>
  </div>
</section>

    </main>
  );
}
