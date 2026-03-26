"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Navbar from "../components/Navbar";

export default function SignIn() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await signIn("credentials", {
        email: formData.get("email"),
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
    <div>
      <div className="mb-20">
        <Navbar />
      </div>

      <div className="flex flex-col gap-9 container w-1/4 bg-gray-200 mx-auto min-h-128 rounded p-6">
        <h1 className="text-center text-2xl">Sign In</h1>

        {error && (
          <p className="text-red-600 text-sm text-center bg-red-50 border border-red-200 rounded p-2">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-9">
          <div className="flex flex-col items-center rounded">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              className="bg-white"
              required
            />
          </div>

          <div className="flex flex-col items-center rounded">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              className="bg-white"
              required
            />
          </div>

          <button
            className="bg-white disabled:opacity-50"
            type="submit"
            disabled={isPending}
          >
            {isPending ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm pb-4">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
