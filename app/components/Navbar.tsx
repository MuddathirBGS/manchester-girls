"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const isCoach = pathname.startsWith("/coach");
  const isParent = pathname === "/";

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-pink-600 via-pink-500 to-black text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">

        <div className="flex items-center gap-3">
          <img
            src="https://lightslategrey-lobster-819582.hostingersite.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-04-at-11.51.29.jpeg"
            alt="Manchester Girls FC"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-md object-cover shadow-md"
          />

          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-2xl md:text-3xl font-extrabold tracking-tight leading-tight truncate">
              Manchester Girls FC
            </h1>
            <p className="text-xs sm:text-sm opacity-90 truncate">
              the home of girls football
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 mt-4">

          <div className="flex flex-wrap gap-2">
            <Link href="/coach">
              <div
                className={`px-4 py-2 rounded-full text-sm sm:text-base font-semibold transition-all duration-200
                ${
                  isCoach
                    ? "bg-white text-pink-600 shadow-md"
                    : "bg-white/20 hover:bg-white/30"
                }`}
              >
                Coach
              </div>
            </Link>

            <Link href="/">
              <div
                className={`px-4 py-2 rounded-full text-sm sm:text-base font-semibold transition-all duration-200
                ${
                  isParent
                    ? "bg-white text-pink-600 shadow-md"
                    : "bg-white/20 hover:bg-white/30"
                }`}
              >
                Parent
              </div>
            </Link>
          </div>

          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm sm:text-base bg-white text-pink-600 rounded-lg font-semibold shadow hover:scale-105 transition">
              Add
            </button>

            <button className="px-4 py-2 text-sm sm:text-base bg-black/40 rounded-lg font-semibold hover:bg-black/60 transition">
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
