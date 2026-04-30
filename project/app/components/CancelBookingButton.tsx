"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function CancelBookingButton({
  orderId,
}: {
  orderId: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleConfirm() {
    startTransition(async () => {
      setError(null);

      try {
        const res = await fetch(`/api/bookings/${orderId}`, {
          method: "DELETE",
        });

        const data = await res.json();
        if (!res.ok) {
          setError(data?.error ?? "Unable to cancel booking.");
          return;
        }

        router.push("/account");
      } catch (err) {
        setError("Unable to cancel booking.");
      }
    });
  }

  return (
    <div>
      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
      {confirming ? (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isPending}
            className="rounded-xl bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Cancelling..." : "Confirm Cancel"}
          </button>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            disabled={isPending}
            className="rounded-xl bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Keep Booking
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="rounded-xl bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
        >
          Cancel Booking
        </button>
      )}
    </div>
  );
}
