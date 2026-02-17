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
    <header className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3">

        {/* TOP ROW */}
        <div className="flex items-center justify-between">

          {/* LEFT — LOGO + TITLE */}
          <div className="flex items-center gap-3">
            <img
              src="https://lightslategrey-lobster-819582.hostingersite.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-04-at-11.51.29.jpeg"
              className="w-10 h-10 rounded-full object-cover border-2 border-white"
            />

            <div className="leading-tight">
              <div className="font-bold text-sm md:text-lg">
                Manchester Girls FC
              </div>
              <div className="text-[10px] md:text-xs opacity-90">
                the home of girls football
              </div>
            </div>
          </div>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-3">

            <Link href="/coach">
              <div
                className={`px-4 py-2 rounded-full font-semibold transition
                ${isCoach
                  ? "bg-white text-pink-600"
                  : "bg-white/20 hover:bg-white/30"}`}
              >
                Coach
              </div>
            </Link>

            <Link href="/">
              <div
                className={`px-4 py-2 rounded-full font-semibold transition
                ${isParent
                  ? "bg-white text-pink-600"
                  : "bg-white/20 hover:bg-white/30"}`}
              >
                Parent
              </div>
            </Link>

            <button className="ml-4 bg-white text-pink-600 px-4 py-2 rounded-full font-semibold shadow hover:scale-105 transition">
              Add
            </button>

            <button className="bg-black/30 px-4 py-2 rounded-full font-semibold hover:bg-black/50 transition">
              Logout
            </button>
          </div>

          {/* HAMBURGER (MOBILE ONLY) */}
          <button
            className="md:hidden text-2xl font-bold"
            onClick={() => setOpen(!open)}
          >
            ☰
          </button>
        </div>

        {/* MOBILE MENU */}
        {open && (
          <div className="md:hidden mt-4">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-3 space-y-2 shadow-2xl">

              <Link href="/coach" onClick={() => setOpen(false)}>
                <div
                  className={`flex items-center justify-between px-4 py-3 rounded-xl font-semibold transition
                  ${
                    isCoach
                      ? "bg-white text-pink-600 shadow"
                      : "bg-white/5 hover:bg-white/15"
                  }`}
                >
                  <span>Coach Dashboard</span>
                  <span className="text-sm opacity-70">→</span>
                </div>
              </Link>

              <Link href="/" onClick={() => setOpen(false)}>
                <div
                  className={`flex items-center justify-between px-4 py-3 rounded-xl font-semibold transition
                  ${
                    isParent
                      ? "bg-white text-pink-600 shadow"
                      : "bg-white/5 hover:bg-white/15"
                  }`}
                >
                  <span>Parent View</span>
                  <span className="text-sm opacity-70">→</span>
                </div>
              </Link>

              <div className="border-t border-white/20 my-2" />

              <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 font-semibold shadow hover:scale-[1.02] transition">
                <span>Add Something</span>
                <span>＋</span>
              </button>

              <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-black/40 font-semibold hover:bg-black/60 transition">
                <span>Logout</span>
                <span>⇥</span>
              </button>

            </div>
          </div>
        )}
      </div>
    </header>
  );
}
