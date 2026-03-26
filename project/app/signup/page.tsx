"use client";
import { useState, useTransition } from "react";
import Navbar from "../components/Navbar";
import { signUp } from "@/auth/actions";

export default function SignUp() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const formData = new FormData(e.currentTarget);
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
    <div>
      <div className="mb-20">
        <Navbar />
      </div>

      <div className="flex flex-col gap-6 container w-1/4 bg-gray-200 mx-auto min-h-128 rounded p-6">
        <h1 className="text-center text-2xl">Sign Up</h1>

        {error && (
          <p className="text-red-600 text-sm text-center bg-red-50 border border-red-200 rounded p-2">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-700 text-sm text-center bg-green-50 border border-green-200 rounded p-2">
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              autoComplete="email"
              className="bg-white rounded px-2 py-1"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              autoComplete="username"
              className="bg-white rounded px-2 py-1"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              autoComplete="new-password"
              className="bg-white rounded px-2 py-1"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              autoComplete="new-password"
              className="bg-white rounded px-2 py-1"
              required
            />
          </div>

          <button
            className="bg-white rounded py-2 mt-2 disabled:opacity-50"
            type="submit"
            disabled={isPending}
          >
            {isPending ? "Signing up…" : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm pb-4">
          Already have an account?{" "}
          <a href="/signin" className="underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
