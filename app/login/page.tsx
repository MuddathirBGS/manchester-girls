"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-200 via-pink-100 to-white">
      <div className="bg-white p-6 rounded-xl shadow w-[400px]">
        <h2 className="text-xl font-bold mb-4">Parent Login</h2>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border p-2 rounded-lg mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={() => signIn("email", { email })}
          className="w-full bg-pink-500 text-white py-2 rounded-lg font-semibold"
        >
          Send Login Link
        </button>
      </div>
    </div>
  );
}
