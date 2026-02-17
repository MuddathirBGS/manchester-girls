"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function Toast({
  show,
  message,
}: {
  show: boolean;
  message: string;
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          className="fixed top-6 right-6 z-[60] bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg font-semibold"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
