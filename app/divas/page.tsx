import Link from "next/link";
import AttendanceButtons from "@/app/components/AttendanceButtons";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

async function getSessions(teamId: string) {
  const res = await fetch(
    `${baseUrl}/api/sessions?teamId=${teamId}`,
    { cache: "no-store" }
  );

  if (!res.ok) return [];
  return res.json();
}

async function getPlayers() {
  const res = await fetch(`${baseUrl}/api/players`, {
    cache: "no-store",
  });

  if (!res.ok) return [];
  return res.json();
}

export default async function DivasPage() {
  const sessions = await getSessions("divas"); // TEAM = DIVAS
  const players = await getPlayers();

  const firstPlayer = players[0]?.id;

  const fixtures = sessions
    .filter((s: any) => s.type !== "TRAINING")
    .slice(0, 3);

  const training = sessions
    .filter((s: any) => s.type === "TRAINING")
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-200 via-pink-100 to-white">
      <div className="max-w-6xl mx-auto px-6 py-8">

        <h1 className="text-3xl font-bold mb-6">Divas</h1>

        {/* FIXTURES */}
        <h2 className="text-xl font-bold mb-4">Upcoming Fixtures</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {fixtures.map((s: any) => (
            <div key={s.id} className="bg-white p-5 rounded-xl shadow">
              <h3 className="font-semibold">{s.title}</h3>
              <p>{new Date(s.date).toLocaleDateString()} {s.time}</p>
              <p>{s.location}</p>

              {firstPlayer && (
                <AttendanceButtons
                  sessionId={s.id}
                  playerId={firstPlayer}
                />
              )}
            </div>
          ))}
        </div>

        {/* TRAINING */}
        <h2 className="text-xl font-bold mb-4">Training</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {training.map((t: any) => (
            <div key={t.id} className="bg-white p-5 rounded-xl shadow">
              <h3 className="font-semibold">{t.title}</h3>
              <p>{new Date(t.date).toLocaleDateString()} {t.time}</p>
              <p>{t.location}</p>

              {firstPlayer && (
                <AttendanceButtons
                  sessionId={t.id}
                  playerId={firstPlayer}
                />
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
