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
    <header className="w-full bg-pink-500 text-white shadow-md">

      <div className="max-w-7xl mx-auto px-6">

        {/* MAIN ROW */}
        <div className="flex items-center justify-between h-16">

          {/* LEFT — CLUB */}
          <div className="flex items-center gap-4">
            <img
              src="https://lightslategrey-lobster-819582.hostingersite.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-04-at-11.51.29.jpeg"
              className="w-10 h-10 rounded-full object-cover border-2 border-white/80"
            />

            <div className="leading-tight">
              <div className="font-bold text-base tracking-wide">
                Manchester Girls FC
              </div>
              <div className="text-xs opacity-80">
                Performance Hub
              </div>
            </div>
          </div>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">

            <Link
              href="/coach"
              className={`transition ${
                isCoach
                  ? "border-b-2 border-white pb-1"
                  : "opacity-90 hover:opacity-100"
              }`}
            >
              Coach
            </Link>

            <Link
              href="/"
              className={`transition ${
                isParent
                  ? "border-b-2 border-white pb-1"
                  : "opacity-90 hover:opacity-100"
              }`}
            >
              Parent
            </Link>

            <div className="w-px h-5 bg-white/40" />

            <button className="bg-white text-pink-500 px-4 py-2 rounded-lg font-semibold hover:bg-pink-50 transition">
              Add
            </button>

            <button className="opacity-80 hover:opacity-100 transition">
              Logout
            </button>
          </nav>

          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden text-2xl"
            onClick={() => setOpen(!open)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* MOBILE DROPDOWN */}
      {open && (
        <div className="md:hidden bg-white text-zinc-900 border-t border-pink-200">
          <div className="px-6 py-4 space-y-4">

            <Link
              href="/coach"
              onClick={() => setOpen(false)}
              className={`block font-semibold ${
                isCoach ? "text-pink-500" : "text-zinc-700"
              }`}
            >
              Coach Dashboard
            </Link>

            <Link
              href="/"
              onClick={() => setOpen(false)}
              className={`block font-semibold ${
                isParent ? "text-pink-500" : "text-zinc-700"
              }`}
            >
              Parent View
            </Link>

            <div className="border-t border-pink-200 pt-4" />

            <button className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-lg font-semibold">
              Add
            </button>

            <button className="w-full text-left text-zinc-600">
              Logout
            </button>

          </div>
        </div>
      )}
    </header>
  );
}