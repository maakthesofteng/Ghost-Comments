import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#071026] text-white flex flex-col">
      {/* Navbar */}
      <header className="w-full">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold">Ghost Comments</span>
          </div>

          <nav className="flex items-center gap-3">
            <Link
              href="/sign-in"
              className="px-4 py-2 rounded-md border border-white/20 text-sm text-white/90 hover:bg-white/5 transition"
            >
              Sign In
            </Link>

            <Link
              href="/sign-up"
              className="px-4 py-2 rounded-full bg-linear-to-r from-indigo-500 to-violet-500 text-sm font-medium shadow-lg hover:opacity-95 transition"
            >
              Sign Up
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <section className="text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
              Welcome to <span className="text-white">Ghost Comments</span>
            </h1>
            <p className="mt-6 text-gray-300 max-w-xl text-lg">
              Send anonymous messages, get honest reactions, and discover meaningful insights. Plus,
              use smart AI message suggestions to craft clearer, kinder replies and get the most out
              of every conversation.
            </p>

            <div className="mt-8 flex items-center gap-4">
              <Link
                href="/sign-up"
                className="inline-block px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-lg"
              >
                Get Started
              </Link>
            </div>
          </section>

          {/* Right: Illustration */}
          <aside className="flex items-center justify-center">
            <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/ghost-pic.webp"
                alt="Ghost illustration"
                width={700}
                height={520}
                className="w-full h-auto block"
              />
            </div>
          </aside>
        </div>
      </main>

      {/* Footer small */}
      <footer className="py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Ghost Comments. All rights are reserved.</p>
        </div>
      </footer>
    </div>
  );
}
