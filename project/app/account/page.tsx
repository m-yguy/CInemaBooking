import ChangePasswordSection from "../components/ChangePasswordSection";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Navbar from "../components/Navbar";
import SignOutButton from "../components/SignOutButton";
import UpdateProfileForm from "../components/UpdateProfileForm";
import { sql } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { hashPassword, comparePassword } from "@/lib/security";
import { sendPasswordChangedEmail, sendProfileUpdatedEmail } from "@/lib/mail";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export default async function AccountPage() {
  const session = await auth();

  if (!session) redirect("/signin");

  const userId = session.user.id;

  const users = await sql`
    SELECT first_name, last_name, email, phone_number
    FROM users
    WHERE user_id = ${userId}
    LIMIT 1
  `;

  const user = users[0];

  async function updateProfile(formData: FormData) {
    "use server";

    const firstName = (formData.get("firstName") as string)?.trim();
    const lastName = (formData.get("lastName") as string)?.trim();
    const phone = (formData.get("phone") as string)?.trim();

    await sql`
      UPDATE users
      SET first_name = ${firstName},
          last_name = ${lastName},
          phone_number = ${phone}
      WHERE user_id = ${userId}
    `;

    revalidatePath("/account");
  }

  async function changePassword(formData: FormData) {
    "use server";

    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;

    if (!currentPassword) return { error: "Enter current password" };
    if (!newPassword) return { error: "New password cannot be empty" };

    if (newPassword.length < 8)
      return { error: "New password must be at least 8 characters" };

    const rows =
      await sql`SELECT password FROM users WHERE user_id = ${userId} LIMIT 1`;
    const stored = rows[0];

    const isValid = await comparePassword(currentPassword, stored.password);
    if (!isValid) return { error: "Password is incorrect" };

    const hashed = await hashPassword(newPassword);
    await sql`UPDATE users SET password = ${hashed} WHERE user_id = ${userId}`;

    await sendPasswordChangedEmail(
      user.email ?? "",
      user.first_name ?? "there",
    );

    return {};
  }

  async function notifyProfileChange(changes: string[]) {
    "use server";
    await sendProfileUpdatedEmail(
      user.email ?? "",
      user.first_name ?? "there",
      changes,
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      <main className="mx-auto w-full max-w-4xl px-6 pt-28 pb-16">
        <h1 className="mb-10 text-4xl font-bold flex items-center gap-4">
          <span className="w-16 h-16 flex items-center justify-center rounded-full bg-black">
            <FontAwesomeIcon icon={faUser} className="text-white w-9 h-9" />
          </span>
          Account
        </h1>

        <div className="space-y-12">
          <section className="border-b border-gray-200 pb-12">
            <h2 className="mb-6 text-2xl font-bold">General Info</h2>

            <UpdateProfileForm
              firstName={user?.first_name ?? ""}
              lastName={user?.last_name ?? ""}
              email={user?.email ?? session.user.email ?? ""}
              phone={user?.phone_number ?? ""}
              action={updateProfile}
              notifyAction={notifyProfileChange}
            />
          </section>

          <section>
            <ChangePasswordSection action={changePassword} />
          </section>

          <div className="pt-4">
            <SignOutButton />
          </div>
        </div>
      </main>
    </div>
  );
}
