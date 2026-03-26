"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { checkEmailVerified } from "@/auth/actions";
import Navbar from "./Navbar";

export default function SignInForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setUnverifiedEmail(null);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    startTransition(async () => {
      const verifyResult = await checkEmailVerified(email);
      if (verifyResult !== null && !verifyResult.verified) {
        setUnverifiedEmail(email);
        return;
      }
      const result = await signIn("credentials", {
        email,
        password: formData.get("password"),
        redirect: false,
      });
      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/");
        router.refresh();
      }
    });
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-8 py-8">
              <div className="flex flex-col items-center mb-6 gap-1.5">
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  Welcome back
                </h1>
                <p className="text-neutral-400 text-sm">
                  Sign in to your account to continue
                </p>
              </div>

              {unverifiedEmail && (
                <div className="mb-6 flex flex-col gap-2 bg-yellow-950/60 border border-yellow-700/60 text-yellow-300 text-sm rounded-lg px-4 py-3">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Please verify your email before signing in.
                  </div>
                  <a
                    href={`/verificationPage?resend=${encodeURIComponent(unverifiedEmail)}`}
                    className="underline text-yellow-200 hover:text-white transition-colors"
                  >
                    Resend verification email →
                  </a>
                </div>
              )}

              {error && (
                <div className="mb-6 flex items-center gap-2 bg-red-950/60 border border-red-800/60 text-red-400 text-sm rounded-lg px-4 py-3">
                  <svg
                    className="w-4 h-4 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-neutral-300"
                  >
                    Email address
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/60 focus:border-red-500/60 transition"
                    onFocus={() => setError(null)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-neutral-300"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/60 focus:border-red-500/60 transition"
                    onFocus={() => setError(null)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="mt-2 w-full bg-red-600 hover:bg-red-500 active:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg py-2.5 text-sm transition-colors duration-150"
                >
                  {isPending ? "Signing in…" : "Sign In"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-neutral-500">
                Don&apos;t have an account?{" "}
                <a
                  href="/signup"
                  className="text-red-400 hover:text-red-300 font-medium transition-colors"
                >
                  Sign up
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
