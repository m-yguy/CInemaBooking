"use client";

import { useState, useTransition, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword } from "@/auth/actions";
import Navbar from "@/app/components/Navbar";

function ResetPasswordForm() {
  const token = useSearchParams().get("token") ?? "";
  const router = useRouter();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await resetPassword(token, newPassword, confirmPassword);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        setTimeout(() => router.push("/signin"), 2500);
      }
    });
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl px-8 py-8">
        <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
          Reset Password
        </h1>
        <p className="text-neutral-400 text-sm mb-6">
          Enter your new password below
        </p>

        {success ? (
          <p className="text-green-400 text-sm">
            Password reset successfully. Redirecting to sign in…
          </p>
        ) : (
          <>
            {error && <p className="mb-4 text-red-400 text-sm">{error}</p>}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="newPassword"
                  className="text-sm font-medium text-neutral-300"
                >
                  New password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setError(null);
                  }}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/60 focus:border-red-500/60 transition"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-neutral-300"
                >
                  Confirm new password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError(null);
                  }}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/60 focus:border-red-500/60 transition"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isPending}
                className="mt-1 w-full bg-red-700 hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg py-2.5 text-sm transition-colors"
              >
                {isPending ? "Resetting…" : "Reset Password"}
              </button>
            </form>
            <p className="mt-6 text-center text-sm">
              <a
                href="/signin"
                className="text-red-400 hover:text-red-300 font-medium transition-colors"
              >
                ← Back to Sign In
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
