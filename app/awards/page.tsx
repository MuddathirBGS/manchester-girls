import prisma from "@/lib/prisma";

export default async function AwardsPage() {
  // --- MONTH RESET LOGIC ---
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const players = await prisma.player.findMany({
    include: {
      stats: true,
      team: true,
      awardVotes: {
        where: {
          createdAt: {
            gte: startOfMonth,
          },
        },
      },
    },
  });

  if (!players.length) {
    return (
      <div className="p-10 text-center text-zinc-500">
        No players found.
      </div>
    );
  }

  // --- PERFORMANCE SCORE ---
  const score = (p: any) =>
    (p.stats?.goals || 0) * 5 +
    (p.stats?.assists || 0) * 3 +
    (p.stats?.saves || 0) * 2;

  // --- PLAYER OF THE MONTH ---
  const playerOfMonth = [...players].sort(
    (a, b) => score(b) - score(a)
  )[0];

  // --- STAT LEADERS ---
  const goldenBoot = [...players].sort(
    (a, b) => (b.stats?.goals || 0) - (a.stats?.goals || 0)
  )[0];

  const assistLeader = [...players].sort(
    (a, b) => (b.stats?.assists || 0) - (a.stats?.assists || 0)
  )[0];

  const saveLeader = [...players].sort(
    (a, b) => (b.stats?.saves || 0) - (a.stats?.saves || 0)
  )[0];

  // --- VOTE WINNERS (THIS MONTH ONLY) ---
  const voteWinner = (type: string) =>
    [...players].sort(
      (a, b) =>
        b.awardVotes.filter((v: any) => v.type === type).length -
        a.awardVotes.filter((v: any) => v.type === type).length
    )[0];

  const coachWinner = voteWinner("COACH");
  const parentWinner = voteWinner("PARENT");
  const trainerWinner = voteWinner("TRAINER");

  const Card = ({ title, player, emoji }: any) => (
    <div className="rounded-2xl p-5 shadow-md bg-white border hover:shadow-lg transition">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-lg text-zinc-800">{title}</h3>
        <span className="text-2xl">{emoji}</span>
      </div>

      {player ? (
        <>
          <div className="text-xl font-semibold text-zinc-800">
            {player.name}
          </div>
          <div className="text-sm text-zinc-500">
            {player.team?.name}
          </div>
        </>
      ) : (
        <div className="text-zinc-400">No winner yet</div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-rose-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-zinc-800">
            Team Awards
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Awards reset monthly •{" "}
            {now.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        {/* PLAYER OF MONTH HERO */}
        {playerOfMonth && (
          <div className="mb-10 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white rounded-2xl p-6 shadow-xl">
            <div className="text-sm opacity-90">
              Player of the Month
            </div>
            <div className="text-3xl md:text-4xl font-bold mt-1">
              {playerOfMonth.name}
            </div>
            <div className="text-sm opacity-90">
              {playerOfMonth.team?.name}
            </div>

            <div className="mt-3 text-lg font-semibold">
              Score: {score(playerOfMonth)}
            </div>
          </div>
        )}

        {/* PERFORMANCE AWARDS */}
        <h2 className="text-xl font-bold mb-4 text-zinc-800">
          Performance Awards
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          <Card title="Golden Boot" player={goldenBoot} emoji="⚽" />
          <Card title="Assist Leader" player={assistLeader} emoji="🎯" />
          <Card title="Save Leader" player={saveLeader} emoji="🧤" />
        </div>

        {/* VOTED AWARDS */}
        <h2 className="text-xl font-bold mb-4 text-zinc-800">
          Voted Awards
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <Card title="Coach Player" player={coachWinner} emoji="🏆" />
          <Card title="Parent Player" player={parentWinner} emoji="👨‍👩‍👧" />
          <Card title="Trainer Player" player={trainerWinner} emoji="🧢" />
        </div>
      </div>
    </div>
  );
}
