import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Navbar from "../components/Navbar";
import SignOutButton from "../components/SignOutButton";

export default async function AccountPage() {
  const session = await auth();

  if (!session) redirect("/signin");

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 max-w-xl mx-auto w-full px-6 mt-24">
        <h1 className="text-3xl font-bold mb-8">Account</h1>

        <div className="bg-gray-100 rounded-xl p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-gray-500">Username</span>
            <span className="font-medium">{session.user.name}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm text-gray-500">Email</span>
            <span className="font-medium">{session.user.email}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm text-gray-500">Role</span>
            <span className="font-medium capitalize">
              {session.user.role.toLowerCase()}
            </span>
          </div>
        </div>

        <div className="mt-6">
          <SignOutButton />
        </div>
      </main>
    </div>
  );
}
