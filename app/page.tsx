import Link from "next/link";
import AttendanceButtons from "@/app/components/AttendanceButtons";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

async function getSessions() {
  const res = await fetch(`${baseUrl}/api/sessions`, {
    cache: "no-store",
  });

  if (!res.ok) return [];

  const data = await res.json();

  return data.sort(
    (a: any, b: any) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

async function getPlayers() {
  const res = await fetch(`${baseUrl}/api/players`, {
    cache: "no-store",
  });

  if (!res.ok) return [];
  return res.json();
}

export default async function Home() {
  const sessions = await getSessions();
  const players = await getPlayers();

  const firstPlayer = players[0]?.id;

  const allFixtures = sessions.filter((s: any) => s.type !== "TRAINING");
  const fixtures = allFixtures.slice(0, 3);

  const training = sessions
    .filter((s: any) => s.type === "TRAINING")
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-200 via-pink-100 to-white">
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* MY CHILDREN */}
        <h1 className="text-2xl font-bold mb-6 text-zinc-900">My Children</h1>

        {players.length === 0 && (
          <p className="text-zinc-500 mb-6">No players added yet.</p>
        )}

        <div className="flex flex-wrap gap-6 mb-8">
          {players.map((p: any) => (
            <div
              key={p.id}
              className="bg-white rounded-xl shadow-md p-5 w-80 border border-pink-200"
            >
              <div className="flex items-center gap-4">
                <img
                  src="https://i.pravatar.cc/80"
                  className="w-14 h-14 rounded-full"
                />
                <div>
                  <div className="font-semibold text-zinc-900">{p.name}</div>
                  <div className="text-pink-500 font-bold">#{p.number}</div>
                  <div className="text-sm text-zinc-500">{p.position}</div>
                </div>
              </div>

              <button className="mt-4 w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-lg font-semibold">
                View Profile
              </button>
            </div>
          ))}
        </div>

        {/* BUTTON ROW */}
        <div className="flex flex-wrap gap-4 mb-10">
          <Link href="/fixtures">
            <div className="px-6 py-2 border-2 border-pink-400 text-pink-500 rounded-lg font-semibold">
              Fixtures
            </div>
          </Link>

          <Link href="/training">
            <div className="px-6 py-2 border-2 border-pink-400 text-pink-500 rounded-lg font-semibold">
              Training
            </div>
          </Link>

          <Link href="/stats">
            <div className="px-6 py-2 border-2 border-pink-400 text-pink-500 rounded-lg font-semibold">
              Team Stats
            </div>
          </Link>

          <Link href="/roster">
            <div className="px-6 py-2 border-2 border-pink-400 text-pink-500 rounded-lg font-semibold">
              Team Roster
            </div>
          </Link>

          <Link href="/photos">
            <div className="px-6 py-2 border-2 border-pink-400 text-pink-500 rounded-lg font-semibold">
              Team Photos
            </div>
          </Link>
        </div>

        {/* FIXTURES */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-zinc-900">Upcoming Fixtures</h1>

          <Link href="/fixtures">
            <span className="text-pink-500 text-sm font-semibold cursor-pointer">
              View All
            </span>
          </Link>
        </div>

        {fixtures.length === 0 && (
          <p className="text-zinc-500">No fixtures yet.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {fixtures.map((s: any) => (
            <div
              key={s.id}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-pink-200"
            >
              <div className="h-2 bg-pink-500" />

              <div className="p-5">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-semibold text-pink-600">
                    {s.title}
                  </h2>

                  {s.kit && (
                    <span className="bg-black text-white text-xs px-3 py-1 rounded-full">
                      {s.kit} KIT
                    </span>
                  )}
                </div>

                <p className="text-sm text-zinc-600 mb-1">
                  📅 {new Date(s.date).toLocaleDateString()} at {s.time}
                </p>

                <p className="text-sm text-zinc-600 mb-1">
                  📍 {s.location}
                </p>

                <p className="text-sm text-zinc-600 mb-3">
                  👥 {s.attendances?.filter((a: any) => a.status === "YES").length || 0} attending
                </p>

                {firstPlayer && (
                  <AttendanceButtons
                    sessionId={s.id}
                    playerId={firstPlayer}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* TRAINING */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-zinc-900">
            Upcoming Training
          </h1>

          <Link href="/training">
            <span className="text-pink-500 text-sm font-semibold cursor-pointer">
              View All
            </span>
          </Link>
        </div>

        {training.length === 0 && (
          <p className="text-zinc-500">No training scheduled.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {training.map((t: any) => (
            <div
              key={t.id}
              className="bg-white rounded-xl shadow-md border border-zinc-200 overflow-hidden"
            >
              <div className="h-2 bg-zinc-900" />

              <div className="p-5">
                <h2 className="font-semibold text-zinc-900 mb-2">
                  {t.title}
                </h2>

                <p className="text-sm text-zinc-600 mb-1">
                  📅 {new Date(t.date).toLocaleDateString()} at {t.time}
                </p>

                <p className="text-sm text-zinc-600 mb-1">
                  📍 {t.location}
                </p>

                <p className="text-sm text-zinc-600 mb-3">
                  👥 {t.attendances?.filter((a: any) => a.status === "YES").length || 0} attending
                </p>

                {firstPlayer && (
                  <AttendanceButtons
                    sessionId={t.id}
                    playerId={firstPlayer}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
