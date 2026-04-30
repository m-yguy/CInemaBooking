"use client";

import Navbar from "@/app/components/Navbar";
import { BookingBuilder, BookingOrder } from "@/lib/builders/bookingBuilder";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import Image from "next/image";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const rawData = searchParams.get("data");
  let bookingData: BookingOrder | null = null;

  if (rawData) {
    try {
      bookingData = BookingBuilder.fromSerialized(rawData, {
        requireEmail: true,
      });
    } catch {
      bookingData = null;
    }
  }

  if (!bookingData) {
    return <p className="text-center mt-20">No confirmation data found.</p>;
  }

  const {
    title,
    time,
    posterUrl,
    selectedSeats,
    quantities,
    total,
    email,
  } = bookingData;

  const originalTotal = Number(searchParams.get("originalTotal")) || null;
  const discountAmount = Number(searchParams.get("discountAmount")) || 0;
  const promoCode = searchParams.get("promoCode");

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-6 w-full mt-24 mb-16 flex flex-col gap-10">
        <div>
          <h1 className="text-4xl font-bold text-green-700">
            Booking Confirmed
          </h1>
          <span className="block border-b-4 border-black mt-2"></span>
          <p className="mt-4 text-gray-700">
            Your confirmation email has been sent to{" "}
            <span className="font-semibold">{email}</span>.
          </p>
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
          <h2 className="text-2xl font-semibold">Ticket Summary</h2>

          {quantities.adult > 0 && (
            <div className="flex justify-between text-lg">
              <span>Adult x{quantities.adult}</span>
              <span>$12 each</span>
            </div>
          )}

          {quantities.child > 0 && (
            <div className="flex justify-between text-lg">
              <span>Child x{quantities.child}</span>
              <span>$8 each</span>
            </div>
          )}

          {quantities.senior > 0 && (
            <div className="flex justify-between text-lg">
              <span>Senior x{quantities.senior}</span>
              <span>$10 each</span>
            </div>
          )}

          {originalTotal && discountAmount > 0 && (
            <>
              <div className="border-t border-gray-300 pt-4 flex justify-between text-lg">
                <span>Original Total</span>
                <span>${originalTotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-lg text-green-700">
                <span>
                  Promo Discount {promoCode ? `(${promoCode})` : ""}
                </span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            </>
          )}

          <div className="border-t border-gray-300 pt-4 flex justify-between text-xl font-bold">
            <span>Final Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </section>

        <button
          onClick={() => router.push("/")}
          className="ml-auto rounded-3xl px-12 py-4 text-white font-bold bg-red-700 hover:bg-red-600 cursor-pointer"
        >
          Back to Home
        </button>
      </main>

      <footer className="bg-black p-8 text-white text-center">
        <span>Footer</span>
      </footer>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}