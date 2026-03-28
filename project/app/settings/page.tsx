import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Navbar from "../components/Navbar";
import { sql } from "@/lib/db";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import DeleteAccountButton from "../components/DeleteAccountButton";

export default async function SettingsPage() {
  const session = await auth();

  if (!session) redirect("/signin");

  const userId = session.user.id;

  async function deleteAccount() {
    "use server";
    await sql`DELETE FROM customers WHERE customer_id = ${userId}`;
    await sql`DELETE FROM users WHERE user_id = ${userId}`;
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      <main className="mx-auto w-full max-w-4xl px-6 pt-28 pb-16">
        <h1 className="mb-10 text-4xl font-bold flex items-center gap-4">
          <span className="w-16 h-16 flex items-center justify-center rounded-full bg-black">
            <FontAwesomeIcon icon={faGear} className="text-white w-9 h-9" />
          </span>
          Settings
        </h1>

        <div className="space-y-12">
          <section className="pb-12">
            <h2 className="mb-2 text-2xl font-bold">Delete Account</h2>
            <p className="mb-1 text-gray-700">
              Deleting your account is{" "}
              <span className="font-semibold">
                permanent and cannot be undone
              </span>
              . All your personal data, bookings, and preferences will be
              removed immediately.
            </p>
            <p className="mb-6 text-sm text-gray-500">
              If you only want to take a break, you can simply sign out instead.
            </p>
            <DeleteAccountButton action={deleteAccount} />
          </section>
        </div>
      </main>
    </div>
  );
}
