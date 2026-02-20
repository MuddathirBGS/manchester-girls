"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CoachSubNav({
  teamId,
}: {
  teamId?: string;
}) {
  const pathname = usePathname();

  const buildHref = (basePath: string) => {
    return teamId ? `${basePath}?teamId=${teamId}` : basePath;
  };

  const links = [
    { label: "Dashboard", href: buildHref("/coach"), match: "/coach" },
    { label: "Live", href: buildHref("/coach/live-stats"), match: "/coach/live-stats" },
    { label: "Attendance", href: buildHref("/attendance"), match: "/attendance" },
    { label: "Statistics", href: buildHref("/coach/stats"), match: "/coach/stats" },
    { label: "Player Codes", href: buildHref("/coach/player-codes"), match: "/coach/player-codes" },
    { label: "Roster", href: buildHref("/coach/manage-teams"), match: "/coach/manage-teams" },
  ];

  return (
    <div className="w-full mt-6 mb-4">
      <div className="max-w-6xl mx-auto px-2">

        <div className="bg-white border border-pink-200 rounded-xl shadow-sm">

          {/* MOBILE SCROLL CONTAINER */}
          <div className="flex md:flex-wrap md:justify-center overflow-x-auto scrollbar-hide px-2 py-2 gap-2">

            {links.map((link) => {
              const active =
                link.match === "/coach"
                  ? pathname === "/coach"
                  : pathname.startsWith(link.match);

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-semibold transition whitespace-nowrap
                    ${
                      active
                        ? "bg-pink-500 text-white shadow-sm"
                        : "text-zinc-600 hover:text-pink-500 hover:bg-pink-50"
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}

          </div>

        </div>
      </div>
    </div>
  );
}