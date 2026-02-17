"use client";

import { useState } from "react";
import Modal from "@/app/components/ui/Modal";

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  variant = "danger",
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "primary";
}) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const confirmStyles =
    variant === "danger"
      ? "bg-red-600 hover:bg-red-700"
      : "bg-pink-600 hover:bg-pink-700";

  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className="relative">

        {/* ❌ Close button */}
        <button
          onClick={onClose}
          className="absolute right-0 top-0 text-zinc-400 hover:text-zinc-700 text-xl font-semibold"
        >
          ×
        </button>

        {/* Content */}
        <div className="pr-6">
          <h2 className="text-xl font-bold mb-2">{title}</h2>

          <p className="text-sm text-zinc-600 mb-6">
            {description}
          </p>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border hover:bg-gray-50 transition w-full sm:w-auto"
            >
              {cancelText}
            </button>

            <button
              onClick={handleConfirm}
              disabled={loading}
              className={`px-4 py-2 text-white rounded-lg font-semibold shadow transition w-full sm:w-auto ${confirmStyles}`}
            >
              {loading ? "Processing..." : confirmText}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
