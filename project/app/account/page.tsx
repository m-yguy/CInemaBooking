import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Navbar from "../components/Navbar";
import SignOutButton from "../components/SignOutButton";
import UpdateProfileForm from "../components/UpdateProfileForm";
import { sql } from "@/lib/db";
import { revalidatePath } from "next/cache";

export default async function AccountPage() {
  const session = await auth();

  if (!session) redirect("/signin");

  const userId = session.user.id;

  const users = await sql`
    SELECT first_name, last_name, email
    FROM users
    WHERE user_id = ${userId}
    LIMIT 1
  `;

  const user = users[0];

  async function updateProfile(formData: FormData) {
    "use server";

    const firstName = (formData.get("firstName") as string)?.trim();
    const lastName = (formData.get("lastName") as string)?.trim();

    await sql`
      UPDATE users
      SET first_name = ${firstName},
          last_name = ${lastName}
      WHERE user_id = ${userId}
    `;

    revalidatePath("/account");
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      <main className="mx-auto w-full max-w-4xl px-6 pt-28 pb-16">
        <h1 className="mb-10 text-4xl font-bold">Account</h1>

        <div className="space-y-12">
          <section className="border-b border-gray-200 pb-12">
            <h2 className="mb-6 text-2xl font-bold">General Info</h2>

            <UpdateProfileForm
              firstName={user?.first_name ?? ""}
              lastName={user?.last_name ?? ""}
              email={user?.email ?? session.user.email ?? ""}
              action={updateProfile}
            />
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">Change Password</h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Current Password
                </label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 outline-none focus:border-black"
                />
              </div>
            </div>
          </section>

          <div className="pt-4">
            <SignOutButton />
          </div>
        </div>
      </main>
    </div>
  );
}