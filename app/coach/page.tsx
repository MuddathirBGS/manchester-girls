"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CoachPage() {
  const [fixtures, setFixtures] = useState<any[]>([]);
  const [training, setTraining] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/sessions")
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.sort(
          (a: any, b: any) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        setFixtures(sorted.filter((s: any) => s.type !== "TRAINING"));
        setTraining(sorted.filter((s: any) => s.type === "TRAINING"));
      });
  }, []);

  const upcomingFixture = fixtures.slice(0, 3);
  const upcomingTraining = training.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-200 via-pink-100 to-white p-8">
      <div className="max-w-6xl mx-auto">

        {/* TOP ROW */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Select Team</h1>

          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-green-100 border border-green-400 text-green-700 rounded-lg font-semibold">
              ⚡ Live Stats
            </button>
            <button className="px-4 py-2 bg-white border rounded-lg font-semibold">
              Player Codes
            </button>
            <button className="px-4 py-2 bg-white border rounded-lg font-semibold">
              Attendance
            </button>
            <button className="px-4 py-2 bg-white border rounded-lg font-semibold">
              Statistics
            </button>

            <Link href="/roster">
              <button className="px-4 py-2 bg-white border rounded-lg font-semibold">
                Team Roster
              </button>
            </Link>

            <button className="px-4 py-2 bg-white border rounded-lg font-semibold">
              Manage Teams
            </button>
          </div>
        </div>

        {/* TEAM CARDS */}
        <div className="flex gap-6 mb-8">
          <div className="bg-pink-500 text-white p-6 rounded-xl w-64 shadow">
            <div className="font-bold text-lg">Dynos</div>
            <div className="text-sm opacity-90">U9</div>
            <div className="text-xs mt-2">Coach: Rick</div>
          </div>

          <div className="bg-white border border-pink-300 p-6 rounded-xl w-64 shadow">
            <div className="font-bold text-lg">Divas</div>
            <div className="text-sm opacity-90">U9</div>
            <div className="text-xs mt-2">Coach: Kristina</div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-6 mb-10">
          <Link href="/coach/add-fixture">
            <div className="bg-pink-500 text-white px-8 py-4 rounded-xl shadow font-semibold cursor-pointer">
              Add Fixture
            </div>
          </Link>

          <Link href="/coach/add-training">
            <div className="bg-black text-white px-8 py-4 rounded-xl shadow font-semibold cursor-pointer">
              Add Training
            </div>
          </Link>

          <div className="bg-purple-600 text-white px-8 py-4 rounded-xl shadow font-semibold">
            Add Tournament
          </div>

          {/* <div className="bg-blue-600 text-white px-8 py-4 rounded-xl shadow font-semibold">
            Share Website
          </div> */}
        </div>

        {/* UPCOMING FIXTURES */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Upcoming Fixtures</h2>
          <Link href="/fixtures">
            <span className="text-pink-500 text-sm font-semibold cursor-pointer">
              View All
            </span>
          </Link>
        </div>

        {upcomingFixture.length === 0 && (
          <p className="text-zinc-500 mb-8">No fixtures scheduled.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {upcomingFixture.map((s: any) => (
            <div
              key={s.id}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-pink-200"
            >
              <div className="h-2 bg-pink-500" />

              <div className="p-5">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-semibold text-zinc-900">
                    {s.title}
                  </h2>

                  {s.kit && (
                    <span className="bg-pink-500 text-white text-xs px-3 py-1 rounded-full">
                      {s.kit.toUpperCase()} KIT
                    </span>
                  )}
                </div>

                <p className="text-sm text-zinc-600 mb-1">
                  📅 {new Date(s.date).toLocaleDateString()} at {s.time}
                </p>

                <p className="text-sm text-zinc-600 mb-1">
                  📍 {s.location}
                </p>

                <p className="text-sm text-zinc-600 mb-1">
                  ⏰ Meet: {s.meetTime || "TBC"}
                </p>

                <p className="text-sm text-zinc-600 mt-2">
                  👥 {s.attendances?.filter((a: any) => a.status === "YES").length || 0} attending
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* UPCOMING TRAINING */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Upcoming Training</h2>
          <Link href="/training">
            <span className="text-black text-sm font-semibold cursor-pointer">
              View All
            </span>
          </Link>
        </div>

        {upcomingTraining.length === 0 && (
          <p className="text-zinc-500">No training scheduled.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingTraining.map((t: any) => (
            <div
              key={t.id}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-zinc-200"
            >
              <div className="h-2 bg-black" />

              <div className="p-5">
                <h2 className="text-lg font-semibold text-zinc-900 mb-2">
                  {t.title}
                </h2>

                <p className="text-sm text-zinc-600 mb-1">
                  📅 {new Date(t.date).toLocaleDateString()} at {t.time}
                </p>

                <p className="text-sm text-zinc-600 mb-1">
                  📍 {t.location}
                </p>

                <p className="text-sm text-zinc-600 mb-1">
                  ⏰ Start: {t.time}
                </p>

                <p className="text-sm text-zinc-600 mt-2">
                  👥 {t.attendances?.filter((a: any) => a.status === "YES").length || 0} attending
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
