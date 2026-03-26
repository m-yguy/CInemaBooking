"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="bg-red-700 text-white px-6 py-3 rounded-xl hover:bg-red-800 transition-colors"
    >
      Sign Out
    </button>
  );
}
