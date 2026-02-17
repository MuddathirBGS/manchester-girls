import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

async function saveStats(formData: FormData) {
  "use server";

  const playerId = formData.get("playerId") as string;
  const goals = Number(formData.get("goals") || 0);
  const assists = Number(formData.get("assists") || 0);
  const saves = Number(formData.get("saves") || 0);

  // upsert = create if missing, update if exists
  const existing = await prisma.stat.findFirst({
    where: { playerId },
  });

  if (existing) {
    await prisma.stat.update({
      where: { id: existing.id },
      data: { goals, assists, saves },
    });
  } else {
    await prisma.stat.create({
      data: {
        playerId,
        goals,
        assists,
        saves,
      },
    });
  }
}

export default async function StatsEditor({ params }: Props) {
  const { id } = await params;

  if (!id) return notFound();

  const player = await prisma.player.findUnique({
    where: { id },
    include: {
      stats: true,
    },
  });

  if (!player) return notFound();

  const stats = player.stats?.[0];

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-200 via-pink-100 to-white p-8">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-6">

        <h1 className="text-2xl font-bold mb-2">Edit Stats</h1>
        <p className="text-zinc-600 mb-6">
          {player.name} #{player.number}
        </p>

        <form action={saveStats} className="space-y-4">
          <input type="hidden" name="playerId" value={player.id} />

          {/* GOALS */}
          <div>
            <label className="text-sm font-semibold">Goals</label>
            <input
              name="goals"
              type="number"
              defaultValue={stats?.goals ?? 0}
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          {/* ASSISTS */}
          <div>
            <label className="text-sm font-semibold">Assists</label>
            <input
              name="assists"
              type="number"
              defaultValue={stats?.assists ?? 0}
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          {/* SAVES */}
          <div>
            <label className="text-sm font-semibold">Saves</label>
            <input
              name="saves"
              type="number"
              defaultValue={stats?.saves ?? 0}
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          <button className="w-full bg-pink-500 text-white py-2 rounded-lg font-semibold mt-4">
            Save Stats
          </button>
        </form>
      </div>
    </div>
  );
}
