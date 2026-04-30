"use client";

import Navbar from "@/app/components/Navbar";
import { BookingBuilder, BookingOrder } from "@/lib/builders/bookingBuilder";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

type SavedCard = {
  id: string;
  cardBrand: string | null;
  cardLastFour: string;
  cardExpMonth: number;
  cardExpYear: number;
};

type PaymentChoice = "saved" | "new";
function getCardDigits(cardNumber: string) {
  return cardNumber.replace(/\D/g, "");
}

function isValidCardLength(cardNumber: string) {
  const digits = getCardDigits(cardNumber);
  return digits.length >= 13 && digits.length <= 16;
}

function isValidExpiryDate(expiryDate: string) {
  const [monthText, yearText] = expiryDate.split("/");

  const month = Number(monthText);
  let year = Number(yearText);

  if (!month || month < 1 || month > 12) return false;
  if (!yearText || yearText.length < 2) return false;

  if (yearText.length === 2) {
    year += 2000;
  }

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;

  return true;
}

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();

  const [promoCode, setPromoCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [finalTotal, setFinalTotal] = useState<number | null>(null);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [email, setEmail] = useState(session?.user?.email ?? "");

  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [selectedCardId, setSelectedCardId] = useState("");
  const [paymentChoice, setPaymentChoice] = useState<PaymentChoice>("new");
  const [isLoadingCards, setIsLoadingCards] = useState(false);

  const [nameOnCard, setNameOnCard] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  useEffect(() => {
    setEmail(session?.user?.email ?? "");
  }, [session?.user?.email]);

  useEffect(() => {
    async function loadSavedCards() {
      if (!session?.user) return;

      setIsLoadingCards(true);

      try {
        const resp = await fetch("/api/paymentCards");
        const json = await resp.json();

        if (!resp.ok) return;

        const cards = json.cards ?? [];
        setSavedCards(cards);

        if (cards.length > 0) {
          setPaymentChoice("saved");
          setSelectedCardId(cards[0].id);
        }
      } catch (err) {
        console.error("Failed to load saved cards:", err);
      } finally {
        setIsLoadingCards(false);
      }
    }

    loadSavedCards();
  }, [session?.user]);

  const rawData = searchParams.get("data");
  let bookingData: BookingOrder | null = null;

  if (rawData) {
    try {
      bookingData = BookingBuilder.fromSerialized(rawData);
    } catch {
      bookingData = null;
    }
  }

  if (!bookingData) {
    return <p className="text-center mt-20">No booking data found.</p>;
  }

  const { title, time, posterUrl, selectedSeats, total } = bookingData;
  const displayedTotal = finalTotal ?? total;

  async function applyPromoCode() {
    setPromoMessage(null);
    setPromoError(null);

    if (!promoCode.trim()) {
      setPromoError("Please enter a promo code.");
      return;
    }

    setIsApplyingPromo(true);

    try {
      const resp = await fetch("/api/promotions/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promoCode,
          orderTotal: total,
        }),
      });

      const json = await resp.json();

      if (!resp.ok || !json.ok) {
        setPromoError(json.error || "Invalid promo code.");
        setDiscountAmount(0);
        setFinalTotal(null);
        return;
      }

      setDiscountAmount(json.discountAmount);
      setFinalTotal(json.finalTotal);
      setPromoMessage(json.message);
    } catch (err) {
      console.error(err);
      setPromoError("Something went wrong while applying the promo code.");
    } finally {
      setIsApplyingPromo(false);
    }
  }

  function paymentInfoIsValid() {
    if (paymentChoice === "saved") {
      return selectedCardId.length > 0;
    }

    if (!nameOnCard.trim()) {
      setStatusMessage("Please enter the name on the card.");
      return false;
    }

    if (!isValidCardLength(cardNumber)) {
      setStatusMessage("Please enter a valid card number.");
      return false;
    }

    if (!isValidExpiryDate(expiryDate)) {
      setStatusMessage("Please enter a valid expiry date.");
      return false;
    }

    if (cvv.trim().length < 3 || cvv.trim().length > 4) {
      setStatusMessage("Please enter a valid CVV.");
      return false;
    }

    return true;
  }

  async function confirmAndPay() {
    if (!email.includes("@")) {
      setStatusMessage("Please enter a valid email address.");
      return;
    }

    if (!paymentInfoIsValid()) {
      setStatusMessage(
        "Please select a saved card or enter valid card details.",
      );
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const selectedSavedCard = savedCards.find(
        (card) => card.id === selectedCardId,
      );

      const resp = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...bookingData,
          email,
          total: displayedTotal,
          originalTotal: total,
          discountAmount,
          promoCode: discountAmount > 0 ? promoCode : null,
          firstName: session?.user?.first_name,
          paymentMethod:
            paymentChoice === "saved"
              ? {
                  type: "saved",
                  cardId: selectedCardId,
                  cardBrand: selectedSavedCard?.cardBrand,
                  cardLastFour: selectedSavedCard?.cardLastFour,
                }
              : {
                  type: "new",
                  cardLastFour: cardNumber.replace(/\s/g, "").slice(-4),
                },
        }),
      });

      const json = await resp.json();

      if (!resp.ok || !json.ok) {
        setStatusMessage("Payment accepted, but confirmation email failed.");
        return;
      }

      setStatusMessage(`Confirmation email sent to ${email}.`);

      setTimeout(() => {
        router.push(
          `/confirmation?data=${encodeURIComponent(
            JSON.stringify({
              ...bookingData,
              email,
              total: displayedTotal,
            }),
          )}&originalTotal=${total}&discountAmount=${discountAmount}&promoCode=${
            discountAmount > 0 ? encodeURIComponent(promoCode) : ""
          }`,
        );
      }, 1200);
    } catch (err) {
      console.error(err);
      setStatusMessage("Something went wrong while confirming your order.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-6 w-full mt-24 mb-16 flex flex-col gap-10">
        <div>
          <h1 className="text-4xl font-bold">Payment</h1>
          <span className="block border-b-4 border-black mt-2"></span>
        </div>

        <section className="bg-black text-white p-6 rounded-xl flex gap-6">
          {posterUrl && (
            <div className="relative w-32 aspect-2/3 rounded-lg overflow-hidden shrink-0">
              <Image
                src={posterUrl}
                alt={title}
                fill
                sizes="128px"
                className="object-cover"
              />
            </div>
          )}

          <div className="flex flex-col justify-center gap-2">
            <p className="text-2xl font-bold">{title}</p>
            <p className="text-gray-300">Showtime: {time}</p>
            <p className="text-gray-300">Seats: {selectedSeats.join(", ")}</p>
          </div>
        </section>

        <section className="bg-gray-100 p-6 rounded-xl flex flex-col gap-4">
          <div className="flex justify-between text-lg">
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>

          {discountAmount > 0 && (
            <div className="flex justify-between text-lg text-green-700">
              <span>Promo Discount</span>
              <span>-${discountAmount.toFixed(2)}</span>
            </div>
          )}

          <div className="border-t border-gray-300 pt-4 flex justify-between text-xl font-bold">
            <span>Total</span>
            <span>${displayedTotal.toFixed(2)}</span>
          </div>
        </section>

        <section className="bg-gray-100 p-6 rounded-xl flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">Promo Code</h2>

          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              className="border border-gray-300 rounded-lg px-4 py-3 text-lg flex-1 focus:outline-none"
            />

            <button
              type="button"
              onClick={applyPromoCode}
              disabled={isApplyingPromo}
              className="rounded-lg px-6 py-3 font-bold text-white bg-red-700 hover:bg-red-600 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isApplyingPromo ? "Applying..." : "Apply"}
            </button>
          </div>

          {promoMessage && <p className="text-green-700">{promoMessage}</p>}
          {promoError && <p className="text-red-700">{promoError}</p>}
        </section>

        <section className="bg-gray-100 p-6 rounded-xl flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">Email Confirmation</h2>
          <p className="text-gray-600">
            We&apos;ll send your booking confirmation here.
          </p>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-3 text-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </section>

        <section className="bg-gray-100 p-6 rounded-xl flex flex-col gap-6">
          <h2 className="text-2xl font-semibold">Payment Method</h2>

          {isLoadingCards && (
            <p className="text-gray-600">Loading saved payment methods...</p>
          )}

          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 cursor-pointer">
              <input
                type="radio"
                name="paymentChoice"
                checked={paymentChoice === "saved"}
                onChange={() => setPaymentChoice("saved")}
              />
              <span className="font-semibold">Use saved payment method</span>
            </label>

            {paymentChoice === "saved" && (
              <div className="flex flex-col gap-3 pl-6">
                {savedCards.length === 0 ? (
                  <div className="rounded-lg border border-gray-300 bg-white p-4 text-gray-600">
                    No cards available.
                  </div>
                ) : (
                  savedCards.map((card) => (
                    <label
                      key={card.id}
                      className={`flex items-center justify-between rounded-lg border px-4 py-3 cursor-pointer ${
                        selectedCardId === card.id
                          ? "border-red-700 bg-red-50"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="savedCard"
                          checked={selectedCardId === card.id}
                          onChange={() => setSelectedCardId(card.id)}
                        />

                        <div>
                          <p className="font-semibold">
                            {card.cardBrand || "Card"} •••• {card.cardLastFour}
                          </p>
                          <p className="text-sm text-gray-500">
                            Expires {card.cardExpMonth}/{card.cardExpYear}
                          </p>
                        </div>
                      </div>
                    </label>
                  ))
                )}
              </div>
            )}
          </div>

          <label className="flex items-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 cursor-pointer">
            <input
              type="radio"
              name="paymentChoice"
              checked={paymentChoice === "new"}
              onChange={() => setPaymentChoice("new")}
            />
            <span className="font-semibold">Enter a new card</span>
          </label>

          {paymentChoice === "new" && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-medium text-gray-700">
                  Name on Card
                </label>
                <input
                  type="text"
                  placeholder="Full name as on card"
                  value={nameOnCard}
                  onChange={(e) => setNameOnCard(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-3 text-lg w-full focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-medium text-gray-700">Card Number</label>
                <input
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  value={cardNumber}
                  onChange={(e) => {
                    const digits = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 16);
                    const formatted = digits.replace(/(.{4})/g, "$1 ").trim();
                    setCardNumber(formatted);
                  }}
                  className="border border-gray-300 rounded-lg px-4 py-3 text-lg w-full focus:outline-none tracking-widest"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col gap-2 flex-1">
                  <label className="font-medium text-gray-700">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={(e) => {
                      const digits = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 4);

                      if (digits.length <= 2) {
                        setExpiryDate(digits);
                      } else {
                        setExpiryDate(
                          `${digits.slice(0, 2)}/${digits.slice(2)}`,
                        );
                      }
                    }}
                    maxLength={5}
                    className="border border-gray-300 rounded-lg px-4 py-3 text-lg w-full focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-2 flex-1">
                  <label className="font-medium text-gray-700">CVV</label>
                  <input
                    type="text"
                    placeholder="..."
                    value={cvv}
                    onChange={(e) =>
                      setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))
                    }
                    maxLength={4}
                    className="border border-gray-300 rounded-lg px-4 py-3 text-lg w-full focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </section>

        <button
          onClick={confirmAndPay}
          disabled={isSubmitting || !email.includes("@")}
          className="ml-auto rounded-3xl px-12 py-4 text-white font-bold bg-red-700 hover:bg-red-600 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting
            ? "Processing..."
            : `Confirm & Pay — $${displayedTotal.toFixed(2)}`}
        </button>

        {statusMessage && (
          <p className="text-center text-red-700 font-medium">
            {statusMessage}
          </p>
        )}
      </main>

      <footer className="bg-black p-8 text-white text-center">
        <span>Footer</span>
      </footer>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}
