"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import AddParentDialog from "../components/dialogs/AddParentDialog";
import AddPlayerDialog from "../components/dialogs/AddPlayerDialog";
import AddFixtureDialog from "../components/dialogs/AddFixtureDialog";
import AddTrainingDialog from "../components/dialogs/AddTrainingDialog";
import AddtournamentDialog from "../components/dialogs/AddtournamentDialog";
import CoachSubNav from "../components/CoachSubNav";

export default function CoachPage() {
  const DYNOS_ID = "cmltjiw8a0000396i44vrndkn";
const DIVAS_ID = "cmltjixjz0001396i0ybecwvr";

  const [fixtures, setFixtures] = useState<any[]>([]);
  const [training, setTraining] = useState<any[]>([]);
  const [players, setPlayers] = useState<any[]>([]);
  const [teamId, setTeamId] = useState<string>(DYNOS_ID);

  const [highlighted, setHighlighted] = useState<string | null>(null);

  const [showParent, setShowParent] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [showFixture, setShowFixture] = useState(false);
  const [showTraining, setShowTraining] = useState(false);
  const [showTournament, setShowTournament] = useState(false);

  useEffect(() => {
    if (!teamId) return;

    fetch(`/api/sessions?teamId=${teamId}`)
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.sort(
          (a: any, b: any) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        const f = sorted.filter((s: any) => s.type !== "TRAINING");
        const t = sorted.filter((s: any) => s.type === "TRAINING");

        setFixtures(f);
        setTraining(t);

        // highlight newest fixture briefly
        if (f.length > 0) {
          setHighlighted(f[0].id);
          setTimeout(() => setHighlighted(null), 3500);
        }
      });

    fetch(`/api/players?teamId=${teamId}`)
      .then((res) => res.json())
      .then((data) => setPlayers(data));
  }, [teamId]);

  const upcomingFixture = fixtures.slice(0, 3);
  const upcomingTraining = training.slice(0, 3);

  const kitColor = (kit: string) => {
    if (!kit) return "bg-gray-300 text-gray-800";
    const k = kit.toLowerCase();
    if (k === "pink") return "bg-pink-600 text-white";
    if (k === "black") return "bg-black text-white";
    if (k === "white") return "bg-gray-200 text-gray-900";
    return "bg-pink-500 text-white";
  };

  const score = (p: any) =>
    (p.stats?.goals || 0) * 5 +
    (p.stats?.assists || 0) * 3 +
    (p.stats?.saves || 0) * 2;

  const teamPlayers = players.filter((p: any) => p.teamId === teamId);

  const playerOfMonth = [...teamPlayers].sort(
    (a, b) => score(b) - score(a)
  )[0];

  const goldenBoot = [...teamPlayers].sort(
    (a, b) => (b.stats?.goals || 0) - (a.stats?.goals || 0)
  )[0];

  const coachLeader = [...teamPlayers].sort(
    (a, b) =>
      (b.awardVotes?.filter((v: any) => v.type === "COACH").length || 0) -
      (a.awardVotes?.filter((v: any) => v.type === "COACH").length || 0)
  )[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-pink-50 to-rose-100 p-4 md:p-10">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-black">
            Coach Dashboard
          </h1>
<CoachSubNav teamId={teamId} />

          
        </div>

        {/* TEAM SELECTOR */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          <div
            onClick={() => setTeamId(DYNOS_ID)}
            className={`cursor-pointer p-6 rounded-2xl shadow-md border transition-all ${
              teamId === DYNOS_ID
                ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg"
                : "bg-white hover:shadow-lg"
            }`}
          >
            <div className="font-bold text-xl">Dynos</div>
            <div className="text-sm opacity-90">U9</div>
            <div className="text-xs mt-2 opacity-80">Coach: Rick</div>
          </div>

          <div
            onClick={() => setTeamId(DIVAS_ID)}
            className={`cursor-pointer p-6 rounded-2xl shadow-md border transition-all ${
              teamId === DIVAS_ID
                ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg"
                : "bg-white hover:shadow-lg"
            }`}
          >
            <div className="font-bold text-xl">Divas</div>
            <div className="text-sm opacity-90">U9</div>
            <div className="text-xs mt-2 opacity-80">Coach: Kristina</div>
          </div>
        </div>

        {/* TEAM AWARDS */}
        {teamPlayers.length > 0 && (
          <div className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border rounded-xl p-5 shadow-md">
              <div className="text-xs text-zinc-500">Player of Month</div>
              <div className="text-lg font-bold text-pink-600">
                {playerOfMonth?.name || "—"}
              </div>
            </div>

            <div className="bg-white border rounded-xl p-5 shadow-md">
              <div className="text-xs text-zinc-500">Top Scorer</div>
              <div className="text-lg font-bold text-pink-600">
                {goldenBoot?.name || "—"}
              </div>
            </div>

            <div className="bg-white border rounded-xl p-5 shadow-md">
              <div className="text-xs text-zinc-500">Trainee of the Week</div>
              <div className="text-lg font-bold text-pink-600">
                {coachLeader?.name || "—"}
              </div>
            </div>
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          <button onClick={() => setShowParent(true)} className="bg-gradient-to-r from-pink-500 to-pink-700 text-white p-4 rounded-xl shadow-md font-semibold hover:scale-105 hover:shadow-lg transition">
            Add Parent
          </button>

          <button onClick={() => setShowPlayer(true)} className="bg-gradient-to-r from-pink-500 to-pink-700 text-white p-4 rounded-xl shadow-md font-semibold hover:scale-105 hover:shadow-lg transition">
            Add Player
          </button>

          <button onClick={() => setShowFixture(true)} className="bg-gradient-to-r from-pink-500 to-pink-700 text-white p-4 rounded-xl shadow-md font-semibold hover:scale-105 hover:shadow-lg transition">
            Add Fixture
          </button>

          <button onClick={() => setShowTraining(true)} className="bg-gradient-to-r from-pink-500 to-pink-700 text-white p-4 rounded-xl shadow-md font-semibold hover:scale-105 hover:shadow-lg transition">
            Add Training
          </button>

          <button onClick={() => setShowTournament(true)} className="bg-gradient-to-r from-pink-500 to-pink-700 text-white p-4 rounded-xl shadow-md font-semibold hover:scale-105 hover:shadow-lg transition">
            Add Tournament
          </button>
        </div>

        {/* FIXTURES */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-black">Upcoming Fixtures</h2>
          <Link href="/fixtures" className="text-sm text-pink-600 font-semibold hover:underline">
            View All
          </Link>
        </div>

        {upcomingFixture.length === 0 && (
          <p className="text-zinc-500 mb-8">No fixtures scheduled.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {upcomingFixture.map((s: any) => {
            const attending =
              s.attendances?.filter((a: any) => a.status === "YES").length || 0;

            const isNew = highlighted === s.id;

            return (
              <div
                key={s.id}
                className={`bg-white rounded-2xl border overflow-hidden transition-all
                ${isNew ? "shadow-2xl ring-4 ring-pink-400 scale-[1.02]" : "shadow-md"}
                hover:shadow-lg hover:-translate-y-1`}
              >
                <div className="h-1 bg-gradient-to-r from-pink-600 to-rose-600" />
                <div className="p-5">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-lg text-black">
                      {s.title}
                    </h3>

                    {s.kit && (
                      <span className={`text-xs px-3 py-1 rounded-full font-bold ${kitColor(s.kit)}`}>
                        {s.kit.toUpperCase()} KIT
                      </span>
                    )}
                  </div>

                  <div className="text-sm text-zinc-700 mb-1">
                    📅 {new Date(s.date).toLocaleDateString()} at {s.time}
                  </div>

                  {s.location && (
                    <div className="text-sm text-zinc-600 mb-1">
                      📍 {s.location}
                    </div>
                  )}

                  {s.meetTime && (
                    <div className="text-sm text-zinc-600">
                      ⏰ Meet: {s.meetTime}
                    </div>
                  )}

                  <div className="text-sm text-zinc-600 mt-3">
                    👥 {attending} attending
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* TRAINING */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-black">Upcoming Training</h2>
          <Link href="/training" className="text-sm text-pink-600 font-semibold hover:underline">
            View All
          </Link>
        </div>

        {upcomingTraining.length === 0 && (
          <p className="text-zinc-500">No training scheduled.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {upcomingTraining.map((t: any) => {
            const attending =
              t.attendances?.filter((a: any) => a.status === "YES").length || 0;

            return (
              <div key={t.id} className="bg-white rounded-2xl shadow-md border hover:shadow-lg hover:-translate-y-1 transition overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-black to-black" />
                <div className="p-5">
                  <h3 className="font-semibold text-lg text-black mb-3">
                    {t.title}
                  </h3>

                  <div className="text-sm text-zinc-700 mb-1">
                    📅 {new Date(t.date).toLocaleDateString()} at {t.time}
                  </div>

                  {t.location && (
                    <div className="text-sm text-zinc-600 mb-1">
                      📍 {t.location}
                    </div>
                  )}

                  {t.meetTime && (
                    <div className="text-sm text-zinc-600">
                      ⏰ Meet: {t.meetTime}
                    </div>
                  )}

                  <div className="text-sm text-zinc-600 mt-3">
                    👥 {attending} attending
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <AddParentDialog open={showParent} onClose={() => setShowParent(false)} />
        <AddPlayerDialog open={showPlayer} teamId={teamId} onClose={() => setShowPlayer(false)} />
        <AddFixtureDialog open={showFixture} teamId={teamId} onClose={() => setShowFixture(false)} />
        <AddTrainingDialog open={showTraining} teamId={teamId} onClose={() => setShowTraining(false)} />
        <AddtournamentDialog open={showTournament} teamId={teamId} onClose={() => setShowTournament(false)} />

      </div>
    </div>
  );
}
