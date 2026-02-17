"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddParentPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);

  const update = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/parents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (res.ok) {
      alert("Parent added successfully!");
      router.push("/coach/manage-teams");
      router.refresh();
    } else {
      const msg = await res.text();
      alert("Error adding parent: " + msg);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-200 via-pink-100 to-white flex items-center justify-center p-6">
      <div className="bg-white w-[420px] rounded-2xl shadow-xl p-8 border border-pink-200">

        <h2 className="text-2xl font-bold text-pink-700 mb-6">
          Add Parent
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* NAME */}
          <div>
            <label className="text-sm font-semibold text-zinc-700">
              Parent Name
            </label>
            <input
              className="w-full border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 rounded-lg p-2 mt-1 outline-none"
              placeholder="e.g. Sarah Johnson"
              onChange={(e) => update("name", e.target.value)}
              required
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-sm font-semibold text-zinc-700">
              Email
            </label>
            <input
              type="email"
              className="w-full border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 rounded-lg p-2 mt-1 outline-none"
              placeholder="parent@email.com"
              onChange={(e) => update("email", e.target.value)}
              required
            />
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => router.push("/coach/manage-teams")}
              className="px-4 py-2 rounded-lg border border-zinc-300 hover:bg-zinc-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-semibold shadow"
            >
              {loading ? "Saving..." : "Add Parent"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
