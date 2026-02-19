import LiveStatsClient from "./LiveStatsClient";

const DYNOS_ID = "cmlp8lhno00004lay76ixxb2n";
const DIVAS_ID = "cmlp8lji200014lays2jfga30";

async function getData(teamId: string) {
  // Automatically resolve correct domain (preview or production)
  const base =
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

  const [playersRes, sessionsRes] = await Promise.all([
    fetch(`${base}/api/players?teamId=${teamId}`, {
      cache: "no-store",
    }),
    fetch(`${base}/api/sessions?teamId=${teamId}`, {
      cache: "no-store",
    }),
  ]);

  if (!playersRes.ok || !sessionsRes.ok) {
    throw new Error("Failed to fetch live stats data");
  }

  const players = await playersRes.json();
  const sessions = await sessionsRes.json();

  const filtered = sessions
    .filter((s: any) => s.type !== "TRAINING")
    .sort(
      (a: any, b: any) =>
        new Date(a.date).getTime() -
        new Date(b.date).getTime()
    );

  return { players, sessions: filtered };
}

export default async function LiveStatsPage({
  searchParams,
}: {
  searchParams: Promise<{ team?: string; session?: string }>;
}) {
  const params = await searchParams;

  const teamId = params.team || DYNOS_ID;
  const sessionId = params.session;

  const { players, sessions } = await getData(teamId);

  const selectedSession =
    sessions.find((s: any) => s.id === sessionId) || null;

  return (
    <LiveStatsClient
      players={players}
      sessions={sessions}
      selectedSession={selectedSession}
      teamId={teamId}
      DYNOS_ID={DYNOS_ID}
      DIVAS_ID={DIVAS_ID}
    />
  );
}
