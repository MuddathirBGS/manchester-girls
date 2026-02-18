"use client";

import { useRouter } from "next/navigation";

export default function TeamSelector({
  teamId,
  DYNOS_ID,
  DIVAS_ID,
}: {
  teamId: string;
  DYNOS_ID: string;
  DIVAS_ID: string;
}) {
  const router = useRouter();

  return (
    <select
      value={teamId}
      onChange={(e) =>
        router.push(`/coach/live-stats?team=${e.target.value}`)
      }
      className="w-full md:w-72 border-2 border-pink-300 rounded-lg p-3"
    >
      <option value={DYNOS_ID}>Dynos</option>
      <option value={DIVAS_ID}>Divas</option>
    </select>
  );
}
