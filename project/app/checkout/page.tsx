"use client";

import Navbar from "@/app/components/Navbar";
import { BookingBuilder, BookingOrder } from "@/lib/builders/bookingBuilder";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";

const prices = { adult: 12, child: 8, senior: 10 };

function CheckoutContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<"success" | "error" | null>(
    null,
  );
  const [isSending, setIsSending] = useState(false);

  const rawData = searchParams.get("data");
  let bookingData: BookingOrder | null = null;
  if (rawData) {
    try {
      bookingData = BookingBuilder.fromSerialized(rawData);
    } catch {
      bookingData = null;
    }
  }

  const [email, setEmail] = useState(session?.user?.email ?? "");

  if (!bookingData) {
    return <p className="text-center mt-20">No booking data found.</p>;
  }

  const { title, time, posterUrl, showId, selectedSeats, quantities, total } =
    bookingData;

  async function goToPayment() {
    let paymentData: BookingOrder;
    try {
      paymentData = new BookingBuilder()
        .setShowInfo({ title, time, posterUrl, showId })
        .setSeats(selectedSeats)
        .setTickets(quantities)
        .setTotal(total)
        .setEmail(email)
        .build({ requireEmail: true });
    } catch {
      return;
    }

    const encoded = encodeURIComponent(JSON.stringify(paymentData));

    // send booking confirmation before navigating to payment
    setIsSending(true);
    setStatusMessage(null);
    setStatusType(null);
    try {
      const resp = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...paymentData,
          firstName: session?.user?.first_name,
        }),
      });
      const json = await resp.json();
      if (!resp.ok || !json.ok) {
        setStatusMessage(
          "Proceeding to payment — confirmation email failed to send.",
        );
        setStatusType("error");
      } else {
        setStatusMessage(`Confirmation email sent to ${paymentData.email}`);
        setStatusType("success");
      }
    } catch (err) {
      console.error(err);
      setStatusMessage(
        "An unexpected error occurred while sending confirmation email.",
      );
      setStatusType("error");
    } finally {
      setIsSending(false);
      setTimeout(() => router.push(`/payment?data=${encoded}`), 1500);
    }
  }

  let buttonColor = "bg-gray-400 cursor-not-allowed";
  if (email.includes("@"))
    buttonColor = "bg-red-700 hover:bg-red-600 cursor-pointer";

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-6 w-full mt-24 mb-16 flex flex-col gap-10">
        <div>
          <h1 className="text-4xl font-bold">Order Summary</h1>
          <span className="block border-b-4 border-black mt-2"></span>
        </div>

        {/* Movie Info */}
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

        {/* Ticket Breakdown */}
        <section className="bg-gray-100 p-6 rounded-xl flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">Tickets</h2>

          {Object.keys(quantities).map((type) => {
            const count = quantities[type as keyof typeof quantities];
            if (count === 0) return null;
            return (
              <div key={type} className="flex justify-between text-lg">
                <span className="capitalize">
                  {type} x{count}
                </span>
                <span>${prices[type as keyof typeof prices]} each</span>
              </div>
            );
          })}

          <div className="border-t border-gray-300 pt-4 flex justify-between text-xl font-bold">
            <span>Total (before tax)</span>
            <span>${total}</span>
          </div>
        </section>

        {/* Email */}
        <section className="bg-gray-100 p-6 rounded-xl flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">Confirm Your Email</h2>
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

        <div className="flex flex-col gap-3">
          <div className="self-end">
            <button
              onClick={goToPayment}
              disabled={!email.includes("@") || isSending}
              className={`rounded-3xl px-12 py-4 text-white font-bold ${
                !email.includes("@") || isSending
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-700 hover:bg-red-600 cursor-pointer"
              }`}
            >
              {isSending ? "Sending confirmation..." : "Proceed to Payment"}
            </button>
          </div>

          {statusMessage && (
            <div
              role="status"
              className={`max-w-xl w-full mx-auto text-center px-4 py-3 rounded ${
                statusType === "success"
                  ? "bg-green-50 text-green-800"
                  : "bg-red-50 text-red-800"
              }`}
            >
              {statusMessage}
            </div>
          )}
        </div>
      </main>

      <footer className="bg-black p-8 text-white text-center">
        <span>Footer</span>
      </footer>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
