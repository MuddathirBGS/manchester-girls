import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

type Props = {
  params: {
    id: string;
  };
};

export default async function PlayerStatsPage({ params }: Props) {
  const { id } = params;

  if (!id) return notFound();

  const player = await prisma.player.findUnique({
    where: { id },
    include: {
      team: true,
      stats: true,
    },
  });

  if (!player) return notFound();

  // Use existing stats or default
  const stat = player.stats?.[0] || {
    goals: 0,
    assists: 0,
    saves: 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-200 via-pink-100 to-white p-8">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-6">

        <h1 className="text-2xl font-bold mb-2">
          Edit Stats — {player.name}
        </h1>

        <p className="text-sm text-zinc-500 mb-6">
          {player.team?.name} • #{player.number}
        </p>

        <form
          action={async (formData) => {
            "use server";

            const goals = Number(formData.get("goals") || 0);
            const assists = Number(formData.get("assists") || 0);
            const saves = Number(formData.get("saves") || 0);

            await prisma.stat.upsert({
              where: { playerId: player.id },
              update: { goals, assists, saves },
              create: {
                playerId: player.id,
                goals,
                assists,
                saves,
              },
            });
          }}
          className="space-y-4"
        >
          {/* GOALS */}
          <div>
            <label className="text-sm font-semibold">Goals</label>
            <input
              type="number"
              name="goals"
              defaultValue={stat.goals}
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          {/* ASSISTS */}
          <div>
            <label className="text-sm font-semibold">Assists</label>
            <input
              type="number"
              name="assists"
              defaultValue={stat.assists}
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          {/* SAVES */}
          <div>
            <label className="text-sm font-semibold">Saves</label>
            <input
              type="number"
              name="saves"
              defaultValue={stat.saves}
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          {/* SAVE BUTTON */}
          <button
            type="submit"
            className="w-full bg-pink-500 text-white py-3 rounded-lg font-semibold mt-4"
          >
            Save Stats
          </button>
        </form>
      </div>
    </div>
  );
}
