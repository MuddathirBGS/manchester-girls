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
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-pink-600 via-pink-500 to-black text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3">

        {/* TOP ROW */}
        <div className="flex items-center justify-between">

          {/* LEFT — LOGO + NAME */}
          <div className="flex items-center gap-3">
            <img
              src="https://lightslategrey-lobster-819582.hostingersite.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-04-at-11.51.29.jpeg"
              alt="MGFC"
              className="w-10 h-10 rounded-md object-cover"
            />

            <div className="leading-tight">
              <div className="text-lg font-extrabold">
                Manchester Girls FC
              </div>
              <div className="text-xs opacity-90">
                the home of girls football
              </div>
            </div>
          </div>

          {/* RIGHT — HAMBURGER */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-2xl font-bold"
          >
            ☰
          </button>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/coach">
              <div
                className={`px-4 py-2 rounded-full text-sm font-semibold transition
                ${
                  isCoach
                    ? "bg-white text-pink-600"
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
                    ? "bg-white text-pink-600"
                    : "bg-white/20 hover:bg-white/30"
                }`}
              >
                Parent
              </div>
            </Link>

            <button className="px-4 py-2 bg-white text-pink-600 rounded-lg font-semibold">
              Add
            </button>

            <button className="px-4 py-2 bg-black/40 rounded-lg font-semibold">
              Logout
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {open && (
          <div className="md:hidden mt-4 space-y-3 border-t border-white/20 pt-4">

            <Link href="/coach" onClick={() => setOpen(false)}>
              <div
                className={`w-full px-4 py-3 rounded-lg text-center font-semibold
                ${
                  isCoach
                    ? "bg-white text-pink-600"
                    : "bg-white/20"
                }`}
              >
                Coach
              </div>
            </Link>

            <Link href="/" onClick={() => setOpen(false)}>
              <div
                className={`w-full px-4 py-3 rounded-lg text-center font-semibold
                ${
                  isParent
                    ? "bg-white text-pink-600"
                    : "bg-white/20"
                }`}
              >
                Parent
              </div>
            </Link>

            <button className="w-full px-4 py-3 bg-white text-pink-600 rounded-lg font-semibold">
              Add
            </button>

            <button className="w-full px-4 py-3 bg-black/40 rounded-lg font-semibold">
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
