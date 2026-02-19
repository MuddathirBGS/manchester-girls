"use client";

import { useEffect, useState } from "react";
import AttendanceButtons from "@/app/components/AttendanceButtons";
import EditFixtureDialog from "@/app/components/dialogs/EditFixtureDialog";
import TraineeOfWeekDialog from "@/app/components/dialogs/TraineeOfWeekDialog";

export default function TrainingPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [players, setPlayers] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [trainee, setTrainee] = useState<any | null>(null);

  const load = async () => {
    const res = await fetch("/api/sessions", { cache: "no-store" });
    const data = await res.json();

    const sorted = data.sort(
      (a: any, b: any) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    setSessions(sorted.filter((s: any) => s.type === "TRAINING"));

    const pRes = await fetch("/api/players", { cache: "no-store" });
    const pData = await pRes.json();
    setPlayers(pData);
  };

  useEffect(() => {
    load();
  }, []);

  const firstPlayer = players[0]?.id;

  const now = new Date();
  const isPast = (date: string) =>
    new Date(date).getTime() < now.getTime();

  const addTrainingPhoto = async (session: any) => {
    const url = prompt("Paste training photo URL");
    if (!url) return;

    await fetch(`/api/sessions/${session.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trainingPhoto: url }),
    });

    load();
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-200 via-pink-100 to-white">
      <div className="max-w-6xl mx-auto px-6 py-8">

        <h1 className="text-3xl font-bold text-zinc-900 mb-6">
          All Training
        </h1>

        {sessions.length === 0 && (
          <p className="text-zinc-500">No training added yet.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {sessions.map((t: any) => {
            const past = isPast(t.date);

            return (
              <div
                key={t.id}
                className="
                  rounded-2xl
                  border
                  bg-white
                  overflow-hidden
                  min-h-[420px]
                  shadow-sm
                  border-pink-200
                  transition-all
                  duration-200
                  hover:-translate-y-1
                  hover:shadow-xl
                "
              >
                <div className="h-1.5 bg-pink-500" />

                <div className="p-6 h-[380px] flex flex-col">

                  {/* HEADER */}
                  <div className="flex justify-between items-start mb-3 min-h-[58px]">
                    <div>
                      <h2 className="text-lg font-bold text-zinc-900 leading-tight">
                        {t.title}
                      </h2>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full font-semibold">
                          TRAINING
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setEditing(t)}
                      className="text-xs bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded-full font-semibold"
                    >
                      Edit
                    </button>
                  </div>

                  {/* META */}
                  <div className="space-y-1 text-sm text-zinc-700 min-h-[90px]">
                    <p>
                      📅 {new Date(t.date).toLocaleDateString()} • {t.time}
                    </p>

                    {t.location && <p>📍 {t.location}</p>}
                    {t.meetTime && <p>⏰ Meet: {t.meetTime}</p>}
                  </div>

                  {/* NOTES */}
                  <div className="min-h-[40px] mb-3">
                    {t.notes && (
                      <p className="text-sm text-zinc-600">
                        <span className="font-semibold text-pink-600">
                          Notes:
                        </span>{" "}
                        {t.notes}
                      </p>
                    )}
                  </div>

                  {/* POST TRAINING SECTION */}
                  {past && (
                    <div className="mb-3 space-y-2">
                      <button
                        onClick={() => addTrainingPhoto(t)}
                        className="w-full text-xs bg-pink-500 text-white py-2 rounded-lg font-semibold hover:bg-pink-600"
                      >
                        📸 {t.trainingPhoto ? "Update Photo" : "Add Training Photo"}
                      </button>

                      <button
                        onClick={() => setTrainee(t)}
                        className="w-full text-xs bg-pink-100 text-pink-700 py-2 rounded-lg font-semibold hover:bg-pink-200"
                      >
                        ⭐ Trainee of the Week
                      </button>
                    </div>
                  )}

                  {/* ATTENDANCE COUNT */}
                  <p className="text-sm text-zinc-600 mb-4">
                    👥 {t.attendances?.filter((a: any) => a.status === "YES").length || 0} attending
                  </p>

                  {/* BUTTONS */}
                  <div className="mt-auto">
                    {firstPlayer && (
                      <AttendanceButtons
                        sessionId={t.id}
                        playerId={firstPlayer}
                      />
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* EDIT MODAL */}
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

      {/* TRAINEE OF WEEK MODAL */}
      {trainee && (
        <TraineeOfWeekDialog
          open={!!trainee}
          onClose={() => setTrainee(null)}
          sessionId={trainee.id}
          players={players}
          onSaved={load}
        />
      )}
    </div>
  );
}
