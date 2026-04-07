"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import { checkEmailVerified, requestPasswordReset } from "@/auth/actions";
import Navbar from "./Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTriangleExclamation,
  faCircleExclamation,
  faCircleCheck,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";

export default function SignInForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);

  // Forgot password state
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);
  const [forgotPending, startForgotTransition] = useTransition();

  function handleForgotSubmit(e: React.FormEvent) {
    e.preventDefault();
    setForgotError(null);
    setForgotSuccess(null);
    startForgotTransition(async () => {
      const result = await requestPasswordReset(forgotEmail);
      if (result.error) {
        setForgotError(result.error);
      } else {
        setForgotSuccess(result.success ?? "Reset link sent.");
      }
    });
  }

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
        const session = await getSession();
        if (session?.user?.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/");
        }
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
                    <FontAwesomeIcon
                      icon={faTriangleExclamation}
                      className="w-4 h-4 shrink-0"
                    />
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
                  <FontAwesomeIcon
                    icon={faCircleExclamation}
                    className="w-4 h-4 shrink-0"
                  />
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
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      id="password"
                      autoComplete="current-password"
                      placeholder="••••••••"
                      className="w-full bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/60 focus:border-red-500/60 transition"
                      onFocus={() => setError(null)}
                      required
                    />
                    <button
                      type="button"
                      onMouseDown={() => setShowPassword(true)}
                      onMouseUp={() => setShowPassword(false)}
                      onMouseLeave={() => setShowPassword(false)}
                      onTouchStart={() => setShowPassword(true)}
                      onTouchEnd={() => setShowPassword(false)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200"
                      tabIndex={-1}
                    >
                      <FontAwesomeIcon
                        icon={showPassword ? faEye : faEyeSlash}
                        className="w-4 h-4"
                      />
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="mt-2 w-full bg-red-700 hover:bg-red-800 active:bg-red-900 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg py-2.5 text-sm transition-colors duration-150"
                >
                  {isPending ? "Signing in…" : "Sign In"}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgot(true);
                      setForgotEmail("");
                      setForgotError(null);
                      setForgotSuccess(null);
                    }}
                    className="text-sm text-neutral-400 hover:text-neutral-200 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
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

      {showForgot && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setShowForgot(false)}
        >
          <div
            className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Forgot Password</h2>
              <button
                type="button"
                onClick={() => setShowForgot(false)}
                className="text-neutral-400 hover:text-neutral-200 text-2xl leading-none"
              >
                &times;
              </button>
            </div>
            <p className="text-neutral-400 text-sm mb-4">
              Enter your email address and we&apos;ll send you a link to reset
              your password.
            </p>

            {forgotSuccess ? (
              <div className="flex items-center gap-2 bg-green-950/60 border border-green-700/60 text-green-300 text-sm rounded-lg px-4 py-3">
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  className="w-4 h-4 shrink-0"
                />
                {forgotSuccess}
              </div>
            ) : (
              <form
                onSubmit={handleForgotSubmit}
                className="flex flex-col gap-4"
              >
                {forgotError && (
                  <div className="flex items-center gap-2 bg-red-950/60 border border-red-800/60 text-red-400 text-sm rounded-lg px-4 py-3">
                    <FontAwesomeIcon
                      icon={faCircleExclamation}
                      className="w-4 h-4 shrink-0"
                    />
                    {forgotError}
                  </div>
                )}
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => {
                    setForgotEmail(e.target.value);
                    setForgotError(null);
                  }}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/60 focus:border-red-500/60 transition"
                  required
                />
                <button
                  type="submit"
                  disabled={forgotPending}
                  className="w-full bg-red-700 hover:bg-red-800 active:bg-red-900 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg py-2.5 text-sm transition-colors duration-150"
                >
                  {forgotPending ? "Sending…" : "Send Reset Link"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
