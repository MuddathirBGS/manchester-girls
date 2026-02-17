"use client";

import { useRouter } from "next/navigation";

export default function AttendanceButtons({
  sessionId,
  playerId,
}: {
  sessionId: string;
  playerId: string;
}) {
  const router = useRouter();

  const send = async (status: "YES" | "NO" | "MAYBE") => {
    await fetch("/api/attendance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        playerId,
        sessionId,
        status,
      }),
    });

    router.refresh(); // smoother than reload
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => send("YES")}
        className="flex-1 border-2 border-pink-500 text-pink-500 py-2 rounded-lg text-sm font-semibold hover:bg-pink-50"
      >
        ✓ Attending
      </button>

      <button
        onClick={() => send("NO")}
        className="flex-1 border-2 border-pink-500 text-pink-500 py-2 rounded-lg text-sm font-semibold hover:bg-pink-50"
      >
        ✕ No
      </button>

      <button
        onClick={() => send("MAYBE")}
        className="flex-1 border-2 border-pink-500 text-pink-500 py-2 rounded-lg text-sm font-semibold hover:bg-pink-50"
      >
        ? Maybe
      </button>
    </div>
  );
}
