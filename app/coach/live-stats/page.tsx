import LiveStatsClient from "./LiveStatsClient";

const DYNOS_ID = "cmltjiw8a0000396i44vrndkn";
const DIVAS_ID = "cmltjixjz0001396i0ybecwvr";


async function getData(teamId: string) {
  try {
    const [playersRes, sessionsRes] = await Promise.all([
      fetch(`/api/players?teamId=${teamId}`, {
        cache: "no-store",
      }),
      fetch(`/api/sessions?teamId=${teamId}`, {
        cache: "no-store",
      }),
    ]);

    const playersData = await playersRes.json();
    const sessionsData = await sessionsRes.json();

    // SAFETY: ensure arrays
    const players = Array.isArray(playersData) ? playersData : [];
    const sessions = Array.isArray(sessionsData) ? sessionsData : [];

    const filtered = sessions
      .filter((s: any) => s?.type !== "TRAINING")
      .sort(
        (a: any, b: any) =>
          new Date(a?.date).getTime() -
          new Date(b?.date).getTime()
      );

    return { players, sessions: filtered };
  } catch (error) {
    console.error("LIVE STATS GETDATA ERROR:", error);
    return { players: [], sessions: [] };
  }
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
    sessions.find((s: any) => s?.id === sessionId) || null;

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
