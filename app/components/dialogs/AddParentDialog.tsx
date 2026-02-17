"use client";

import { useState } from "react";
import Modal from "@/app/components/ui/Modal";
import { useToast } from "@/app/components/ui/ToastProvider";

export default function AddParentDialog({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}) {
  const toast = useToast();

  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
    setError("");
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/parents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (res.ok) {
      toast.success("Parent added successfully!");

      onCreated?.();
      onClose();

      setForm({
        name: "",
        email: "",
      });
    } else {
      const msg = await res.text();
      const errorMsg = msg || "Failed to add parent";
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  return (
    <Modal open={open} onClose={onClose} size="sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-pink-700">
          Add Parent
        </h2>

        <button
          onClick={onClose}
          className="text-zinc-400 hover:text-zinc-700 text-xl font-semibold"
        >
          ×
        </button>
      </div>

      {error && (
        <div className="mb-4 text-sm bg-red-100 text-red-700 px-3 py-2 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* NAME */}
        <div>
          <label className="text-sm font-semibold text-zinc-700">
            Parent Name
          </label>
          <input
            className="w-full border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 rounded-lg p-2 mt-1 outline-none transition"
            placeholder="e.g. Sarah Johnson"
            value={form.name}
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
            className="w-full border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 rounded-lg p-2 mt-1 outline-none transition"
            placeholder="parent@email.com"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            required
          />
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-zinc-300 hover:bg-zinc-50 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-semibold shadow transition"
          >
            {loading ? "Saving..." : "Add Parent"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
