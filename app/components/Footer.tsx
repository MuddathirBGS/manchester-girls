"use client";

import Link from "next/link";
import Image from "next/image";
import { Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-zinc-200 mt-16">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">

        {/* TOP */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* BRAND */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/logo.jpeg"
                alt="Manchester Girls FC logo"
                width={48}
                height={48}
                className="object-contain"
              />
              <h3 className="font-bold text-xl text-zinc-900">
                Manchester Girls FC
              </h3>
            </div>

            <p className="text-sm text-zinc-600 leading-relaxed">
              Building confidence, teamwork and football skills in a positive,
              supportive environment for every player.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h4 className="font-semibold text-zinc-800 mb-4 text-sm tracking-wide uppercase">
              Quick Links
            </h4>

            <div className="flex flex-col gap-3 text-sm">
              <Link href="/coach" className="text-zinc-600 hover:text-pink-600 transition-colors">
                Coach Dashboard
              </Link>

              <Link href="/" className="text-zinc-600 hover:text-pink-600 transition-colors">
                Parent Home
              </Link>

              <Link href="/attendance" className="text-zinc-600 hover:text-pink-600 transition-colors">
                Attendance
              </Link>

              <Link href="/roster" className="text-zinc-600 hover:text-pink-600 transition-colors">
                Team Roster
              </Link>
            </div>
          </div>

          {/* CLUB */}
          <div>
            <h4 className="font-semibold text-zinc-800 mb-4 text-sm tracking-wide uppercase">
              Club
            </h4>

            <div className="text-sm text-zinc-600 space-y-3">
              <p>Manchester Girls Football Club</p>
              <p>Est. 2024</p>
              <p>Developing players on and off the pitch.</p>
            </div>
          </div>

          {/* SOCIAL */}
          <div>
            <h4 className="font-semibold text-zinc-800 mb-4 text-sm tracking-wide uppercase">
              Follow Us
            </h4>

            <a
              href="https://www.instagram.com/manchester_girls_fc?igsh=NjFodGdxazQ3dWd2"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm text-zinc-600 hover:text-pink-600 transition-colors"
            >
              <Instagram size={18} />
              <span>Instagram</span>
            </a>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="border-t border-zinc-200 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>
            © {new Date().getFullYear()} Manchester Girls FC. All rights reserved.
          </p>

          <p className="text-center md:text-right">
            Manchester Girls Football Club
          </p>
        </div>
      </div>
    </footer>
  );
}
