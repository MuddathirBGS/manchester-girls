"use client";

import { useEffect, useState } from "react";
import EditFixtureDialog from "@/app/components/dialogs/EditFixtureDialog";
import PotmPickerDialog from "@/app/components/dialogs/PotmPickerDialog";

export default function FixturesPage() {
  const [fixtures, setFixtures] = useState<any[]>([]);
  const [players, setPlayers] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [potm, setPotm] = useState<{
    session: any;
    type: "coach" | "parent";
  } | null>(null);

  const load = async () => {
    const res = await fetch("/api/sessions");
    const data = await res.json();

    const sorted = data.sort(
      (a: any, b: any) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    setFixtures(sorted.filter((s: any) => s.type !== "TRAINING"));

    const pRes = await fetch("/api/players");
    const pData = await pRes.json();
    setPlayers(pData);
  };

  useEffect(() => {
    load();
  }, []);

  const now = new Date();

  const isToday = (date: string) => {
    const d = new Date(date);
    return (
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  };

  const isPast = (date: string) => {
    return new Date(date).getTime() < now.getTime();
  };

  const getKitStyle = (s: any) => {
    if (s.kit?.toLowerCase() === "black")
      return "bg-zinc-900 text-white";
    if (s.kit?.toLowerCase() === "pink")
      return "bg-pink-500 text-white";
    return "bg-zinc-200 text-black";
  };

  const addPhoto = async (session: any) => {
    const url = prompt("Paste photo URL for this fixture");
    if (!url) return;

    await fetch(`/api/sessions/${session.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ photoUrl: url }),
    });

    load();
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-200 via-pink-100 to-white">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-zinc-900 mb-8">
          Fixtures Dashboard
        </h1>

        {fixtures.length === 0 && (
          <p className="text-zinc-500">No fixtures added yet.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">
          {fixtures.map((s: any) => {
            const today = isToday(s.date);
            const past = isPast(s.date);

            return (
              <div
                key={s.id}
                className={`
                  rounded-2xl border bg-white overflow-hidden min-h-[420px]
                  transition-all duration-200 hover:-translate-y-1 hover:shadow-xl
                  ${
                    today
                      ? "border-pink-500 shadow-lg ring-2 ring-pink-200"
                      : "border-pink-100 shadow-sm"
                  }
                  ${past ? "opacity-80" : ""}
                `}
              >
                <div className="h-1.5 bg-pink-500" />

                <div className="p-6 h-[380px] flex flex-col">
                  {/* HEADER */}
                  <div className="flex justify-between items-start mb-3 min-h-[58px]">
                    <div>
                      <h2 className="text-lg font-bold text-zinc-900 leading-tight">
                        {s.title}
                      </h2>

                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {today && (
                          <span className="text-[10px] bg-pink-500 text-white px-2 py-0.5 rounded-full font-bold">
                            TODAY
                          </span>
                        )}

                        {!past && !today && (
                          <span className="text-[10px] bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full font-semibold">
                            UPCOMING
                          </span>
                        )}

                        {past && (
                          <span className="text-[10px] bg-zinc-200 text-zinc-600 px-2 py-0.5 rounded-full font-semibold">
                            PLAYED
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      {s.kit && (
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-semibold ${getKitStyle(
                            s
                          )}`}
                        >
                          {s.kit} KIT
                        </span>
                      )}

                      <button
                        onClick={() => setEditing(s)}
                        className="text-xs bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded-full font-semibold"
                      >
                        Edit
                      </button>
                    </div>
                  </div>

                  {/* META */}
                  <div className="space-y-1 text-sm text-zinc-700 min-h-[90px]">
                    <p>
                      📅 {new Date(s.date).toLocaleDateString()} • {s.time}
                    </p>
                    <p>📍 {s.location}</p>
                    {s.opponent && <p>⚽ vs {s.opponent}</p>}
                    {s.meetTime && <p>⏰ Meet: {s.meetTime}</p>}
                  </div>

                  {/* NOTES */}
                  <div className="min-h-[40px] mb-3">
                    {s.notes && (
                      <p className="text-sm text-zinc-600">
                        <span className="font-semibold text-pink-600">
                          Notes:
                        </span>{" "}
                        {s.notes}
                      </p>
                    )}
                  </div>

                  {/* POST MATCH */}
                  {past && (
                    <div className="mb-3 space-y-2">
                      <button
                        onClick={() => addPhoto(s)}
                        className="w-full text-xs bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-lg font-semibold"
                      >
                        📸 {s.photoUrl ? "Update Photo" : "Add Photo"}
                      </button>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() =>
                            setPotm({ session: s, type: "coach" })
                          }
                          className="text-xs bg-pink-100 text-pink-700 py-2 rounded-lg font-semibold hover:bg-pink-200"
                        >
                          Coach POTM
                        </button>

                        <button
                          onClick={() =>
                            setPotm({ session: s, type: "parent" })
                          }
                          className="text-xs bg-white border border-pink-300 text-pink-600 py-2 rounded-lg font-semibold hover:bg-pink-50"
                        >
                          Parent POTM
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ATTENDANCE */}
                  <div className="mt-auto grid grid-cols-3 gap-2">
                    {["YES", "NO", "MAYBE"].map((status) => (
                      <button
                        key={status}
                        onClick={async () => {
                          await fetch("/api/attendance", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              playerId: players[0]?.id,
                              sessionId: s.id,
                              status,
                            }),
                          });
                          alert("Saved");
                        }}
                        className="border-2 border-pink-300 text-pink-600 py-2 rounded-lg text-sm font-semibold hover:bg-pink-50"
                      >
                        {status === "YES"
                          ? "✓"
                          : status === "NO"
                          ? "✕"
                          : "?"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {editing && (
        <EditFixtureDialog
          fixture={editing}
          open={!!editing}
          onClose={() => setEditing(null)}
          onSaved={async () => {
            setEditing(null);
            await load();
          }}
        />
      )}

      {potm && (
        <PotmPickerDialog
          open={!!potm}
          onClose={() => setPotm(null)}
          sessionId={potm.session.id}
          type={potm.type}
          players={players}
          onSaved={load}
        />
      )}
    </div>
  );
}
