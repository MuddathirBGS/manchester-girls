import AttendanceButtons from "@/app/components/AttendanceButtons";

async function getSessions() {
  const res = await fetch("http://localhost:3000/api/sessions", {
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
  const res = await fetch("http://localhost:3000/api/players", {
    cache: "no-store",
  });

  if (!res.ok) return [];
  return res.json();
}

export default async function TrainingPage() {
  const sessions = await getSessions();
  const players = await getPlayers();

  const firstPlayer = players[0]?.id;

  const training = sessions.filter(
    (s: any) => s.type === "TRAINING"
  );

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-200 via-pink-100 to-white">
      <div className="max-w-6xl mx-auto px-6 py-8">

        <h1 className="text-3xl font-bold text-zinc-900 mb-6">
          All Training
        </h1>

        {training.length === 0 && (
          <p className="text-zinc-500">No training added yet.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {training.map((t: any) => (
            <div
              key={t.id}
              className="bg-white rounded-xl shadow-md border border-zinc-200 overflow-hidden"
            >
              <div className="h-2 bg-black" />

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

                {/* LIVE ATTENDANCE COUNT */}
                <p className="text-sm text-zinc-600 mb-3">
                  👥 {t.attendances?.filter((a: any) => a.status === "YES").length || 0} attending
                </p>

                {/* ATTENDANCE BUTTONS */}
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
