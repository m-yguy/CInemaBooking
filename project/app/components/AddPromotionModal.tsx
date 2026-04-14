"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  addPromotionAction,
  sendPromotionEmailsAction,
} from "@/app/actions/promotionActions";

const TODAY = new Date().toISOString().split("T")[0];

export default function AddPromotionModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const router = useRouter();

  const [promoCode, setPromoCode] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState<"PERCENTAGE" | "FLAT">(
    "PERCENTAGE",
  );
  const [discountAmount, setDiscountAmount] = useState("");
  const [startDate, setStartDate] = useState(TODAY);
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");

  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [createdPromotionId, setCreatedPromotionId] = useState<number | null>(
    null,
  );
  const [isPending, startTransition] = useTransition();
  const [isSending, startSendTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    startTransition(async () => {
      const result = await addPromotionAction({
        promoCode,
        title,
        description,
        discountType,
        discountAmount,
        startDate,
        endDate,
        status,
      });

      if ("error" in result) {
        setError(result.error);
      } else {
        setCreatedPromotionId(result.promotionId);
        setSuccessMsg(
          status === "ACTIVE"
            ? "Promotion created! You can now send it to subscribed users."
            : "Promotion created successfully.",
        );
        router.refresh();
      }
    });
  }

  function handleSendEmails() {
    if (createdPromotionId === null) return;
    setError(null);
    setSuccessMsg(null);

    startSendTransition(async () => {
      const result = await sendPromotionEmailsAction(createdPromotionId);
      if ("error" in result) {
        setError(result.error);
      } else {
        setSuccessMsg(
          result.sent === 0
            ? "No subscribed users found — no emails were sent."
            : `Promotion email sent to ${result.sent} subscriber${result.sent === 1 ? "" : "s"}.`,
        );
      }
    });
  }

  const inputClass =
    "bg-neutral-800 border border-neutral-700 text-white rounded-lg px-4 py-2.5 text-sm placeholder-neutral-500 focus:outline-none focus:border-neutral-500";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Add Promotion</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-neutral-400 hover:text-white transition-colors text-2xl leading-none"
              aria-label="Close"
            >
              &times;
            </button>
          </div>

          {error && (
            <div className="mb-5 flex items-center gap-2 bg-red-950/60 border border-red-800/60 text-red-400 text-sm rounded-lg px-4 py-3">
              <svg
                className="w-4 h-4 shrink-0"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          )}

          {successMsg && (
            <div className="mb-5 flex items-center gap-2 bg-green-950/60 border border-green-800/60 text-green-400 text-sm rounded-lg px-4 py-3">
              <svg
                className="w-4 h-4 shrink-0"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
              {successMsg}
            </div>
          )}

          {/* After creation, offer to send emails if ACTIVE */}
          {createdPromotionId !== null && status === "ACTIVE" && (
            <div className="mb-5">
              <button
                type="button"
                onClick={handleSendEmails}
                disabled={isSending}
                className="w-full bg-blue-700 hover:bg-blue-600 disabled:opacity-50 text-white font-semibold rounded-lg px-4 py-2.5 text-sm transition-colors"
              >
                {isSending
                  ? "Sending emails…"
                  : "Send Promotion Email to Subscribers"}
              </button>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Title */}
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-sm font-medium text-neutral-300">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={200}
                  placeholder="e.g. Summer Flash Sale"
                  className={inputClass}
                  required
                />
              </div>

              {/* Promo Code */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-neutral-300">
                  Promo Code <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  maxLength={50}
                  placeholder="e.g. SUMMER25"
                  className={inputClass}
                  required
                />
              </div>

              {/* Status */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-neutral-300">
                  Status <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <select
                    value={status}
                    onChange={(e) =>
                      setStatus(e.target.value as "ACTIVE" | "INACTIVE")
                    }
                    className={`w-full appearance-none ${inputClass} pr-10`}
                    required
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                  <svg
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 8l4 4 4-4"
                    />
                  </svg>
                </div>
              </div>

              {/* Discount Type */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-neutral-300">
                  Discount Type <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <select
                    value={discountType}
                    onChange={(e) =>
                      setDiscountType(e.target.value as "PERCENTAGE" | "FLAT")
                    }
                    className={`w-full appearance-none ${inputClass} pr-10`}
                    required
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FLAT">Flat ($)</option>
                  </select>
                  <svg
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 8l4 4 4-4"
                    />
                  </svg>
                </div>
              </div>

              {/* Discount Amount */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-neutral-300">
                  Discount Amount{" "}
                  <span className="text-neutral-500 font-normal">
                    ({discountType === "PERCENTAGE" ? "%" : "$"})
                  </span>{" "}
                  <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(e.target.value)}
                  min={0.01}
                  max={discountType === "PERCENTAGE" ? 100 : undefined}
                  step={0.01}
                  placeholder={
                    discountType === "PERCENTAGE" ? "e.g. 20" : "e.g. 5.00"
                  }
                  className={inputClass}
                  required
                />
              </div>

              {/* Start Date */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-neutral-300">
                  Start Date <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={`${inputClass} scheme-dark`}
                  required
                />
              </div>

              {/* End Date */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-neutral-300">
                  End Date <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  value={endDate}
                  min={startDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={`${inputClass} scheme-dark`}
                  required
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-sm font-medium text-neutral-300">
                  Description{" "}
                  <span className="text-neutral-500 font-normal">
                    (optional)
                  </span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={1000}
                  rows={3}
                  placeholder="Brief description shown in the promotion email…"
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold rounded-lg px-4 py-2.5 text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending || createdPromotionId !== null}
                className="flex-1 bg-white hover:bg-neutral-200 disabled:opacity-50 text-black font-semibold rounded-lg px-4 py-2.5 text-sm transition-colors"
              >
                {isPending
                  ? "Creating…"
                  : createdPromotionId !== null
                    ? "Created"
                    : "Create Promotion"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
