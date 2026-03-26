"use client";

import { useState, useTransition } from "react";
import Navbar from "./Navbar";
import { signUp } from "@/auth/actions";

export default function SignUpForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const formData = new FormData(e.currentTarget);

    const email = (formData.get("email") as string)?.trim();
    const username = (formData.get("username") as string)?.trim();
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!email || !username || !password || !confirmPassword) {
      setError("All fields are required. Please fill in every field.");
      return;
    }

    startTransition(async () => {
      try {
        const result = await signUp(formData);
        if (result?.error) {
          setError(result.error);
        } else {
          setSuccess(result.success ?? null);
        }
      } catch {
        setError("Something went wrong. Please try again.");
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
                  Create an account
                </h1>
                <p className="text-neutral-400 text-sm">
                  Sign up to get started
                </p>
              </div>

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

              {success && (
                <div className="mb-6 flex items-center gap-2 bg-green-950/60 border border-green-800/60 text-green-400 text-sm rounded-lg px-4 py-3">
                  <svg
                    className="w-4 h-4 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-neutral-300"
                  >
                    Email address{" "}
                    <span className="relative group cursor-default text-red-500">
                      *
                      <span className="absolute left-4 -top-1 hidden group-hover:block bg-neutral-700 text-neutral-200 text-xs rounded px-2 py-1 whitespace-nowrap shadow-lg z-10">
                        Required
                      </span>
                    </span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/60 focus:border-red-500/60 transition"
                    onFocus={() => setError(null)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="username"
                    className="text-sm font-medium text-neutral-300"
                  >
                    Username{" "}
                    <span className="relative group cursor-default text-red-500">
                      *
                      <span className="absolute left-4 -top-1 hidden group-hover:block bg-neutral-700 text-neutral-200 text-xs rounded px-2 py-1 whitespace-nowrap shadow-lg z-10">
                        Required
                      </span>
                    </span>
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    autoComplete="username"
                    placeholder="your_username"
                    className="bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/60 focus:border-red-500/60 transition"
                    onFocus={() => setError(null)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-neutral-300"
                  >
                    Password{" "}
                    <span className="relative group cursor-default text-red-500">
                      *
                      <span className="absolute left-4 -top-1 hidden group-hover:block bg-neutral-700 text-neutral-200 text-xs rounded px-2 py-1 whitespace-nowrap shadow-lg z-10">
                        Required
                      </span>
                    </span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className="bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/60 focus:border-red-500/60 transition"
                    onFocus={() => setError(null)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium text-neutral-300"
                  >
                    Confirm Password{" "}
                    <span className="relative group cursor-default text-red-500">
                      *
                      <span className="absolute left-4 -top-1 hidden group-hover:block bg-neutral-700 text-neutral-200 text-xs rounded px-2 py-1 whitespace-nowrap shadow-lg z-10">
                        Required
                      </span>
                    </span>
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className="bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/60 focus:border-red-500/60 transition"
                    onFocus={() => setError(null)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="mt-2 w-full bg-red-600 hover:bg-red-500 active:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg py-2.5 text-sm transition-colors duration-150"
                >
                  {isPending ? "Signing up…" : "Sign Up"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-neutral-500">
                Already have an account?{" "}
                <a
                  href="/signin"
                  className="text-red-400 hover:text-red-300 font-medium transition-colors"
                >
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
