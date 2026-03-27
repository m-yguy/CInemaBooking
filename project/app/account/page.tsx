import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Navbar from "../components/Navbar";
import SignOutButton from "../components/SignOutButton";

export default async function AccountPage() {
  const session = await auth();

  if (!session) redirect("/signin");

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      <main className="mx-auto w-full max-w-4xl px-6 pt-28 pb-16">
        <h1 className="mb-10 text-4xl font-bold">Account</h1>

        <div className="space-y-12">
          {/* General Info */}
          <section className="border-b border-gray-200 pb-12">
            <h2 className="mb-6 text-2xl font-bold">General Info</h2>

            <div className="space-y-6">
              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Email
                </label>
                <input
                  type="email"
                  value={session.user.email ?? ""}
                  readOnly
                  className="w-full cursor-not-allowed rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-gray-500 outline-none"
                />
              </div>

              {/* Username */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Username
                </label>
                <input
                  type="text"
                  defaultValue={session.user.name ?? ""}
                  className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 outline-none focus:border-black"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="Enter phone number"
                  className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 outline-none focus:border-black"
                />
              </div>

              {/* Save */}
              <div className="pt-2">
                <button className="rounded-full bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800">
                  Save Changes
                </button>
              </div>
            </div>
          </section>

          {/* Change Password */}
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