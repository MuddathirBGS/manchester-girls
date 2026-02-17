"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isCoach = pathname.startsWith("/coach");
  const isParent = pathname === "/";

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3">

        {/* TOP ROW */}
        <div className="flex items-center justify-between">

          {/* LOGO + TITLE */}
          <div className="flex items-center gap-3 min-w-0">
            <img
              src="https://lightslategrey-lobster-819582.hostingersite.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-04-at-11.51.29.jpeg"
              alt="Manchester Girls FC Logo"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover shrink-0"
            />

            {/* Hide long text on small screens */}
            <div className="hidden sm:block">
              <h1 className="text-base md:text-lg font-bold leading-tight">
                Manchester Girls FC
              </h1>
              <p className="text-xs text-gray-500">
                the home of girls football
              </p>
            </div>
          </div>

          {/* DESKTOP CONTROLS */}
          <div className="hidden md:flex items-center gap-4">

            {/* ROLE SWITCH */}
            <div className="flex gap-2 bg-gray-100 p-1 rounded-full">
              <Link href="/coach">
                <div
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${
                    isCoach
                      ? "bg-pink-600 text-white shadow"
                      : "text-gray-700 hover:bg-white"
                  }`}
                >
                  Coach
                </div>
              </Link>

              <Link href="/">
                <div
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${
                    isParent
                      ? "bg-pink-600 text-white shadow"
                      : "text-gray-700 hover:bg-white"
                  }`}
                >
                  Parent
                </div>
              </Link>
            </div>

            <button className="px-5 py-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-full font-semibold shadow hover:scale-105 transition">
              + Add
            </button>

            <button className="px-4 py-2 border rounded-full text-sm font-semibold hover:bg-gray-100">
              Logout
            </button>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden p-2"
            onClick={() => setOpen(!open)}
          >
            <div className="space-y-1">
              <div className="w-6 h-0.5 bg-black" />
              <div className="w-6 h-0.5 bg-black" />
              <div className="w-6 h-0.5 bg-black" />
            </div>
          </button>
        </div>

        {/* MOBILE DROPDOWN */}
        {open && (
          <div className="md:hidden mt-4 border-t pt-4 space-y-3">

            <div className="grid grid-cols-2 gap-2">
              <Link href="/coach">
                <div
                  className={`text-center py-2 rounded-lg font-semibold ${
                    isCoach
                      ? "bg-pink-600 text-white"
                      : "bg-gray-100"
                  }`}
                >
                  Coach
                </div>
              </Link>

              <Link href="/">
                <div
                  className={`text-center py-2 rounded-lg font-semibold ${
                    isParent
                      ? "bg-pink-600 text-white"
                      : "bg-gray-100"
                  }`}
                >
                  Parent
                </div>
              </Link>
            </div>

            <button className="w-full py-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-lg font-semibold">
              + Add
            </button>

            <button className="w-full py-2 border rounded-lg font-semibold">
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
