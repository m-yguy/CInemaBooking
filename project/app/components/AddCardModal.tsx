"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function formatCardNumber(digits: string) {
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function detectCardBrand(digits: string) {
  if (/^4/.test(digits)) return "Visa";
  if (/^(5[1-5]|2[2-7])/.test(digits)) return "Mastercard";
  if (/^3[47]/.test(digits)) return "American Express";
  if (/^(6011|65|64[4-9]|622)/.test(digits)) return "Discover";
  return "";
}

export default function AddCardModal({
  addressLine1 = "",
  addressLine2 = "",
  city = "",
  state = "",
  postalCode = "",
  country = "",
  mailingAddressId = null,
  onClose,
}: {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  mailingAddressId?: number | null;
  onClose: () => void;
}) {
  const hasAddress = !!addressLine1;
  const router = useRouter();

  const [cardOwner, setCardOwner] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardBrand, setCardBrand] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [billingLine1, setBillingLine1] = useState(addressLine1);
  const [billingLine2, setBillingLine2] = useState(addressLine2);
  const [billingCity, setBillingCity] = useState(city);
  const [billingState, setBillingState] = useState(state);
  const [billingPostal, setBillingPostal] = useState(postalCode);
  const [billingCountry, setBillingCountry] = useState(country);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit() {
    const digits = cardNumber.replace(/\s/g, "");
    if (!cardOwner.trim()) {
      setError("Enter the card owner name");
      return;
    }
    if (digits.length < 13 || digits.length > 16) {
      setError("Enter a valid card number");
      return;
    }
    const month = parseInt(expMonth, 10);
    const year = parseInt(expYear, 10);
    if (!month || month < 1 || month > 12) {
      setError("Enter a valid expiry month (1–12)");
      return;
    }
    if (!year || year < new Date().getFullYear()) {
      setError("Enter a valid expiry year");
      return;
    }
    setError("");
    setPending(true);
    try {
      const res = await fetch("/api/paymentCards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardOwner: cardOwner.trim(),
          cardNumber: digits,
          cardLastFour: digits.slice(-4),
          cardBrand,
          cardExpMonth: month,
          cardExpYear: year,
          existingBillingAddressId: hasAddress
            ? (mailingAddressId ?? undefined)
            : undefined,
          billingLine1: hasAddress ? undefined : billingLine1,
          billingLine2: hasAddress ? undefined : billingLine2,
          billingCity: hasAddress ? undefined : billingCity,
          billingState: hasAddress ? undefined : billingState,
          billingPostal: hasAddress ? undefined : billingPostal,
          billingCountry: hasAddress ? undefined : billingCountry,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to add card");
        return;
      }
      router.refresh();
      onClose();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  const lockedCls = "bg-gray-100 text-gray-500 pointer-events-none select-none";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Add Payment Method</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto max-h-[60vh]">
          <div>
            <label className="mb-1 block text-sm font-semibold">
              Card owner
            </label>
            <input
              type="text"
              value={cardOwner}
              onChange={(e) => setCardOwner(e.target.value)}
              placeholder="Name on card"
              className="w-full rounded-md border border-gray-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold">
              Card number
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={cardNumber}
              onChange={(e) => {
                const d = e.target.value.replace(/\D/g, "").slice(0, 16);
                setCardNumber(formatCardNumber(d));
                setCardBrand(detectCardBrand(d));
              }}
              placeholder="1234 5678 9012 3456"
              className="w-full rounded-md border border-gray-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold">
              Card brand
            </label>
            <input
              readOnly
              value={cardBrand}
              placeholder="Auto-detected"
              className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-gray-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-semibold">
                Expiry month
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={expMonth}
                onChange={(e) =>
                  setExpMonth(e.target.value.replace(/\D/g, "").slice(0, 2))
                }
                placeholder="MM"
                maxLength={2}
                className="w-full rounded-md border border-gray-300 px-4 py-3"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold">
                Expiry year
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={expYear}
                onChange={(e) =>
                  setExpYear(e.target.value.replace(/\D/g, "").slice(0, 4))
                }
                placeholder="YYYY"
                maxLength={4}
                className="w-full rounded-md border border-gray-300 px-4 py-3"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold">
              Billing address
            </label>
            <input
              readOnly={hasAddress}
              value={billingLine1}
              onChange={(e) => setBillingLine1(e.target.value)}
              placeholder="123 Main St"
              maxLength={255}
              className={`w-full rounded-md border border-gray-300 px-4 py-3 ${hasAddress ? lockedCls : ""}`}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold">
              Address line 2
            </label>
            <input
              readOnly={hasAddress}
              value={billingLine2}
              onChange={(e) => setBillingLine2(e.target.value)}
              placeholder="Apt, suite, etc. (optional)"
              maxLength={255}
              className={`w-full rounded-md border border-gray-300 px-4 py-3 ${hasAddress ? lockedCls : ""}`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-semibold">City</label>
              <input
                readOnly={hasAddress}
                value={billingCity}
                onChange={(e) => setBillingCity(e.target.value)}
                placeholder="City"
                maxLength={100}
                className={`w-full rounded-md border border-gray-300 px-4 py-3 ${hasAddress ? lockedCls : ""}`}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold">State</label>
              <input
                readOnly={hasAddress}
                value={billingState}
                onChange={(e) => setBillingState(e.target.value)}
                placeholder="State"
                maxLength={100}
                className={`w-full rounded-md border border-gray-300 px-4 py-3 ${hasAddress ? lockedCls : ""}`}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-40">
              <label className="mb-1 block text-sm font-semibold">
                Postal code
              </label>
              <input
                readOnly={hasAddress}
                value={billingPostal}
                onChange={(e) => setBillingPostal(e.target.value)}
                placeholder="Postal code"
                maxLength={20}
                className={`w-full rounded-md border border-gray-300 px-4 py-3 ${hasAddress ? lockedCls : ""}`}
              />
            </div>
            <div className="w-28">
              <label className="mb-1 block text-sm font-semibold">
                Country
              </label>
              <input
                readOnly={hasAddress}
                value={billingCountry}
                onChange={(e) =>
                  setBillingCountry(e.target.value.toUpperCase().slice(0, 2))
                }
                placeholder="US"
                maxLength={2}
                className={`w-full rounded-md border border-gray-300 px-4 py-3 uppercase ${hasAddress ? lockedCls : ""}`}
              />
            </div>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-gray-300 px-6 py-3 font-semibold text-black hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={pending}
              className="rounded-full bg-red-800 px-6 py-3 font-semibold text-white hover:bg-red-900 disabled:opacity-50"
            >
              {pending ? "Adding..." : "Add Payment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
