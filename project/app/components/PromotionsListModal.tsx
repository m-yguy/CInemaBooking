"use client";

import { useEffect, useState, useTransition } from "react";
import { getPromotionsAction } from "@/app/actions/promotionActions";
import type { Promotion } from "@/lib/services/promotionService";

export default function PromotionsListModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const [promotions, setPromotions] = useState<Promotion[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const result = await getPromotionsAction();
      if ("error" in result) {
        setError(result.error);
      } else {
        setPromotions(result.promotions);
      }
    });
  }, []);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        <div className="px-8 py-6 flex items-center justify-between border-b border-neutral-800">
          <h2 className="text-xl font-bold text-white">All Promotions</h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition-colors text-2xl leading-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <div className="overflow-y-auto px-8 py-6 flex flex-col gap-3">
          {isPending && (
            <p className="text-neutral-400 text-sm text-center py-4">
              Loading promotions...
            </p>
          )}

          {error && (
            <p className="text-red-400 text-sm text-center py-4">{error}</p>
          )}

          {!isPending && promotions && promotions.length === 0 && (
            <p className="text-neutral-400 text-sm text-center py-4">
              No promotions found.
            </p>
          )}

          {promotions &&
            promotions.map((promo) => (
              <div
                key={promo.promo_id}
                className="bg-neutral-800 border border-neutral-700 rounded-xl p-4 flex flex-col gap-1"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-semibold text-white text-sm">
                    {promo.title}
                  </span>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${
                      promo.status === "ACTIVE"
                        ? "bg-green-900 text-green-300"
                        : "bg-neutral-700 text-neutral-400"
                    }`}
                  >
                    {promo.status}
                  </span>
                </div>

                <span className="text-xs font-mono text-yellow-400">
                  {promo.promo_code}
                </span>

                {promo.description && (
                  <p className="text-neutral-400 text-xs mt-0.5">
                    {promo.description}
                  </p>
                )}

                <div className="flex items-center gap-3 mt-1 text-xs text-neutral-400">
                  <span>
                    {promo.discount_type === "PERCENTAGE"
                      ? `${promo.discount_amount}% off`
                      : `$${promo.discount_amount} off`}
                  </span>
                  <span>&middot;</span>
                  <span>
                    {formatDate(promo.start_date)} &ndash;{" "}
                    {formatDate(promo.end_date)}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
