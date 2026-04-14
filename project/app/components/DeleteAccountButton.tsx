"use client";

import { useState, useTransition } from "react";
import { signOut } from "next-auth/react";

export default function DeleteAccountButton({
  action,
}: {
  action: () => Promise<unknown>;
}) {
  const [showModal, setShowModal] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      await action();
      await signOut({ callbackUrl: "/" });
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="bg-red-700 text-white px-6 py-3 rounded-xl hover:bg-red-800 transition-colors font-semibold"
      >
        Delete Account
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-2xl bg-white px-8 py-8 shadow-xl">
            <h2 className="mb-3 text-2xl font-bold text-black">
              Delete Account
            </h2>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete your account? This action is
              permanent and cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                disabled={isPending}
                className="flex-1 rounded-full bg-gray-200 px-6 py-3 font-semibold text-black hover:bg-gray-300 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isPending}
                className="flex-1 rounded-full bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800 disabled:opacity-50"
              >
                {isPending ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
