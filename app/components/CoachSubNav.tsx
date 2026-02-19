"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CoachSubNav({
  teamId,
}: {
  teamId?: string;
}) {
  const pathname = usePathname();

  const links = [
    { label: "Dashboard", href: `/coach?team=${teamId || ""}`, match: "/coach" },
    { label: "Live", href: `/coach/live-stats?team=${teamId || ""}`, match: "/coach/live-stats" },
    { label: "Attendance", href: `/attendance?team=${teamId || ""}`, match: "/attendance" },
    { label: "Statistics", href: `/coach/stats?teamId=${teamId || ""}`, match: "/coach/stats" },
    { label: "Player Codes", href: `/coach/player-codes?team=${teamId || ""}`, match: "/coach/player-codes" },
    { label: "Roster", href: `/coach/manage-teams?team=${teamId || ""}`, match: "/coach/manage-teams" },
  ];

  return (
    <div className="w-full flex justify-center mt-6 mb-2">
      {/* Outer Container */}
      <div className="bg-white shadow-md border border-pink-100 rounded-2xl px-4 py-2">
        <div className="flex items-center gap-2">

          {links.map((link) => {
            // 👇 Exact match for dashboard, startsWith for others
            const active =
              link.match === "/coach"
                ? pathname === "/coach"
                : pathname.startsWith(link.match);

            return (
              <Link
                key={link.label}
                href={link.href}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200
                  ${
                    active
                      ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md"
                      : "text-zinc-600 hover:text-pink-600 hover:bg-pink-50"
                  }`}
              >
                {link.label}
              </Link>
            );
          })}

        </div>
      </div>
    </div>
  );
}
