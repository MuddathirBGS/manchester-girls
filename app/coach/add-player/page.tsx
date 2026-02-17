"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AddPlayerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [parents, setParents] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    number: "",
    position: "",
    teamId: "",
    parentId: "",
  });

  const [showParentModal, setShowParentModal] = useState(false);
  const [newParent, setNewParent] = useState({
    name: "",
    email: "",
  });

  // LOAD TEAM FROM URL
  useEffect(() => {
    const teamFromUrl = searchParams.get("teamId");
    if (teamFromUrl) {
      setForm((prev) => ({ ...prev, teamId: teamFromUrl }));
    }
  }, [searchParams]);

  // SAFE LOAD TEAMS
  const loadTeams = async () => {
    try {
      const res = await fetch("/api/teams");

      if (!res.ok) {
        console.error("Teams failed:", await res.text());
        return;
      }

      const data = await res.json();
      setTeams(data);
    } catch (err) {
      console.error("Teams error:", err);
    }
  };

  // SAFE LOAD PARENTS
  const loadParents = async () => {
    try {
      const res = await fetch("/api/parents");

      if (!res.ok) {
        console.error("Parents failed:", await res.text());
        return;
      }

      const data = await res.json();
      setParents(data);
    } catch (err) {
      console.error("Parents error:", err);
    }
  };

  useEffect(() => {
    loadTeams();
    loadParents();
  }, []);

  const update = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!form.teamId || !form.parentId) {
      alert("Please select team and parent");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/players", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: form.name,
        number: Number(form.number) || null,
        position: form.position || null,
        teamId: form.teamId,
        parentId: form.parentId,
      }),
    });

    setLoading(false);

    if (res.ok) {
      alert("Player added!");

      // CHANGE THIS if you have a real roster page
      router.push("/coach");
      router.refresh();
    } else {
      alert("Error adding player");
    }
  };

  const handleAddParent = async () => {
    if (!newParent.name || !newParent.email) return;

    const res = await fetch("/api/parents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newParent),
    });

    if (res.ok) {
      const created = await res.json();
      await loadParents();

      setForm((prev) => ({ ...prev, parentId: created.id }));
      setShowParentModal(false);
      setNewParent({ name: "", email: "" });
    } else {
      alert("Error creating parent");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-200 via-pink-100 to-white">
      <div className="bg-white w-[440px] rounded-2xl shadow-xl p-6 border">
        <h2 className="text-2xl font-bold mb-5 text-pink-600">
          Add Player
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="text-sm font-semibold">Name</label>
            <input
              className="w-full border rounded-lg p-2 mt-1"
              placeholder="Player name"
              onChange={(e) => update("name", e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Shirt Number</label>
            <input
              type="number"
              className="w-full border rounded-lg p-2 mt-1"
              placeholder="7"
              onChange={(e) => update("number", e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Position</label>
            <input
              className="w-full border rounded-lg p-2 mt-1"
              placeholder="Striker / Defender / Midfielder"
              onChange={(e) => update("position", e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Team</label>
            <select
              className="w-full border rounded-lg p-2 mt-1"
              value={form.teamId}
              onChange={(e) => update("teamId", e.target.value)}
              required
            >
              <option value="">Select team</option>

              {teams.map((team: any) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold">Parent</label>
              <button
                type="button"
                onClick={() => setShowParentModal(true)}
                className="text-xs text-pink-600 font-semibold"
              >
                + Add Parent
              </button>
            </div>

            <select
              className="w-full border rounded-lg p-2 mt-1"
              value={form.parentId}
              onChange={(e) => update("parentId", e.target.value)}
              required
            >
              <option value="">Select parent</option>

              {parents.map((parent: any) => (
                <option key={parent.id} value={parent.id}>
                  {parent.name} ({parent.email})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => router.push("/coach")}
              className="px-4 py-2 rounded-lg border"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-pink-500 text-white rounded-lg font-semibold"
            >
              {loading ? "Saving..." : "Add Player"}
            </button>
          </div>

        </form>
      </div>

      {showParentModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
          <div className="bg-white w-[360px] rounded-xl shadow-xl p-6">
            <h3 className="text-lg font-bold mb-4 text-pink-600">
              Add Parent
            </h3>

            <div className="space-y-3">
              <input
                className="w-full border rounded-lg p-2"
                placeholder="Parent name"
                value={newParent.name}
                onChange={(e) =>
                  setNewParent({ ...newParent, name: e.target.value })
                }
              />

              <input
                className="w-full border rounded-lg p-2"
                placeholder="Email"
                value={newParent.email}
                onChange={(e) =>
                  setNewParent({ ...newParent, email: e.target.value })
                }
              />
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowParentModal(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleAddParent}
                className="px-4 py-2 bg-pink-500 text-white rounded-lg font-semibold"
              >
                Save Parent
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
