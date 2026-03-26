import { neon } from "@neondatabase/serverless";
import Navbar from "../components/Navbar";
import Link from "next/link";
import ResendForm from "./ResendForm";

export default async function VerificationPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>;
}) {
  const { key } = await searchParams;

  let status: "success" | "invalid" | "missing" = "missing";

  if (key) {
    const sql = neon(process.env.DATABASE_URL!);
    const decodedKey = decodeURIComponent(key);

    const result = await sql`
      UPDATE users
      SET verified = true, verification_key = null
      WHERE verification_key = ${decodedKey} AND verified = false
      RETURNING user_id
    `;

    status = result.length > 0 ? "success" : "invalid";
  }

  const isSuccess = status === "success";

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden">
            <div
              className={`h-1.5 w-full bg-linear-to-r ${
                isSuccess
                  ? "from-green-600 via-green-500 to-green-600"
                  : "from-red-600 via-red-500 to-red-600"
              }`}
            />

            <div className="px-8 py-8 flex flex-col items-center text-center">
              {isSuccess ? (
                <>
                  <div className="w-14 h-14 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mb-4">
                    <svg
                      className="w-7 h-7 text-green-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">
                    Email verified!
                  </h1>
                  <p className="text-neutral-400 text-sm mt-1.5 mb-6">
                    Your account has been confirmed. You can now sign in.
                  </p>
                  <Link
                    href="/signin"
                    className="w-full bg-green-600 hover:bg-green-500 active:bg-green-700 text-white font-semibold rounded-lg py-2.5 text-sm transition-colors duration-150 text-center"
                  >
                    Go to Sign In
                  </Link>
                </>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-4">
                    <svg
                      className="w-7 h-7 text-red-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">
                    Verification failed
                  </h1>
                  <p className="text-neutral-400 text-sm mt-1.5">
                    {status === "missing"
                      ? "No verification key was provided."
                      : "This link is invalid or has already been used."}
                  </p>
                  <ResendForm />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
