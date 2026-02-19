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
    <div className="w-full flex justify-center mt-6 mb-2 px-3">
      <div className="w-full max-w-6xl">
        <div className="bg-white shadow-md border border-pink-100 rounded-2xl px-3 py-2 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            {links.map((link) => {
              const active =
                link.match === "/coach"
                  ? pathname === "/coach"
                  : pathname.startsWith(link.match);

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-4 md:px-5 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200
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
    </div>
  );
}
