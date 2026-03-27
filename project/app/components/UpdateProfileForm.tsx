"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function UpdateProfileForm({
  firstName,
  lastName,
  email,
  action,
}: {
  firstName: string;
  lastName: string;
  email: string;
  action: (formData: FormData) => Promise<void>;
}) {
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(formData: FormData) {
    setSuccess(false);

    startTransition(async () => {
      await action(formData);

      setSuccess(true);

      // refresh server data + session
      router.refresh();
    });
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {/* Email */}
      <div>
        <label className="mb-2 block text-sm font-semibold">Email</label>
        <input
          type="email"
          value={email}
          readOnly
          className="w-full cursor-not-allowed rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-gray-500"
        />
      </div>

      {/* First + Last */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold">
            First Name
          </label>
          <input
            name="firstName"
            defaultValue={firstName}
            className="w-full rounded-md border border-gray-300 px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold">
            Last Name
          </label>
          <input
            name="lastName"
            defaultValue={lastName}
            className="w-full rounded-md border border-gray-300 px-4 py-3"
          />
        </div>
      </div>

      {/* Button */}
      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-black px-6 py-3 font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
      >
        {isPending ? "Saving..." : "Save Changes"}
      </button>

      {/* Success message */}
      {success && (
        <p className="text-green-600 text-sm font-medium">
          Changes saved successfully
        </p>
      )}
    </form>
  );
}