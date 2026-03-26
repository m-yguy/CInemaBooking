"use client";

import { useState, useTransition, useEffect } from "react";
import { resendVerification } from "@/auth/actions";

const COOLDOWN_SECONDS = 60;

export default function ResendForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isPending, startTransition] = useTransition();
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    startTransition(async () => {
      const result = await resendVerification(email);
      if (result.error) {
        setMessage({ type: "error", text: result.error });
      } else {
        setMessage({ type: "success", text: result.success! });
        setCooldown(COOLDOWN_SECONDS);
      }
    });
  }

  return (
    <div className="mt-6 w-full border-t border-neutral-700 pt-6">
      <p className="text-neutral-400 text-sm mb-4 text-center">
        Need a new verification link? Enter your email below.
      </p>

      {message && (
        <div
          className={`mb-4 flex items-center gap-2 text-sm rounded-lg px-4 py-3 ${
            message.type === "success"
              ? "bg-green-950/60 border border-green-800/60 text-green-400"
              : "bg-red-950/60 border border-red-800/60 text-red-400"
          }`}
        >
          <svg
            className="w-4 h-4 shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            {message.type === "success" ? (
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            ) : (
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            )}
          </svg>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => setMessage(null)}
          placeholder="you@example.com"
          className="bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/60 focus:border-red-500/60 transition"
        />
        <button
          type="submit"
          disabled={isPending || cooldown > 0}
          className="w-full bg-red-600 hover:bg-red-500 active:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg py-2.5 text-sm transition-colors duration-150"
        >
          {isPending
            ? "Sending…"
            : cooldown > 0
              ? `Resend available in ${cooldown}s`
              : "Resend Verification Email"}
        </button>
      </form>
    </div>
  );
}
