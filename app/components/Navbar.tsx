"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const isCoach = pathname.startsWith("/coach");
  const isParent = pathname === "/";

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-pink-600 via-pink-500 to-black text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 py-4">

        {/* TOP ROW */}
        <div className="flex items-center gap-3">
          <img
            src="https://lightslategrey-lobster-819582.hostingersite.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-04-at-11.51.29.jpeg"
            alt="Manchester Girls FC"
            className="w-10 h-10 rounded-md object-cover"
          />

          <div className="min-w-0">
            <h1 className="text-lg sm:text-2xl font-extrabold leading-tight truncate">
              Manchester Girls FC
            </h1>
            <p className="text-xs opacity-90">the home of girls football</p>
          </div>
        </div>

        {/* BUTTON AREA */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

          {/* ROLE SWITCH */}
          <div className="flex flex-wrap gap-2">
            <Link href="/coach">
              <div
                className={`px-4 py-2 rounded-full text-sm font-semibold transition
                ${
                  isCoach
                    ? "bg-white text-pink-600 shadow"
                    : "bg-white/20 hover:bg-white/30"
                }`}
              >
                Coach
              </div>
            </Link>

            <Link href="/">
              <div
                className={`px-4 py-2 rounded-full text-sm font-semibold transition
                ${
                  isParent
                    ? "bg-white text-pink-600 shadow"
                    : "bg-white/20 hover:bg-white/30"
                }`}
              >
                Parent
              </div>
            </Link>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm bg-white text-pink-600 rounded-lg font-semibold shadow">
              Add
            </button>

            <button className="px-4 py-2 text-sm bg-black/40 rounded-lg font-semibold">
              Logout
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
