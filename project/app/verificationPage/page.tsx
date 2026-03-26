import { neon } from "@neondatabase/serverless";
import Navbar from "../components/Navbar";
import Link from "next/link";
import ResendCard from "./ResendCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faEnvelope,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";

export default async function VerificationPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string; resend?: string }>;
}) {
  const { key, resend } = await searchParams;

  let status: "success" | "invalid" | "missing" | "resend" = "missing";

  if (resend && !key) {
    status = "resend";
  } else if (key) {
    const sql = neon(process.env.DATABASE_URL!);
    const decodedKey = decodeURIComponent(key);

    const result = await sql`
      WITH deleted AS (
        DELETE FROM email_verifications
        WHERE token = ${decodedKey} AND expires_at > NOW()
        RETURNING user_id
      ),
      activated_user AS (
        UPDATE users
        SET verified = true
        WHERE user_id = (SELECT user_id FROM deleted)
        RETURNING user_id
      )
      UPDATE customers
      SET status = 'ACTIVE'
      WHERE customer_id = (SELECT user_id FROM activated_user)
      RETURNING customer_id AS user_id
    `;

    status = result.length > 0 ? "success" : "invalid";
  }

  const isSuccess = status === "success";
  const isResend = status === "resend";

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-8 py-8 flex flex-col items-center text-center">
              {isSuccess ? (
                <>
                  <div className="w-14 h-14 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mb-4">
                    <FontAwesomeIcon
                      icon={faCircleCheck}
                      className="w-7 h-7 text-green-400"
                    />
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
              ) : isResend ? (
                <ResendCard
                  color="yellow"
                  icon={faEnvelope}
                  title="Verify your email"
                  description="Your account isn't verified yet. Resend the link below."
                  defaultEmail={resend}
                />
              ) : (
                <ResendCard
                  color="red"
                  icon={faCircleExclamation}
                  title="Verification failed"
                  description={
                    status === "missing"
                      ? "No verification key was provided."
                      : "This link is invalid or has already been used."
                  }
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
