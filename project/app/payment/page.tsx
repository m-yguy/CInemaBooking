"use client";

import Navbar from "@/app/components/Navbar";
import { BookingBuilder, BookingOrder } from "@/lib/builders/bookingBuilder";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Image from "next/image";

function PaymentContent() {
  const searchParams = useSearchParams();

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
    return <p className="text-center mt-20">No booking data found.</p>;
  }

  const { title, time, posterUrl, selectedSeats, total, email } = bookingData;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-6 w-full mt-24 mb-16 flex flex-col gap-10">
        <div>
          <h1 className="text-4xl font-bold">Payment</h1>
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
            <p className="text-gray-300">Email: {email}</p>
          </div>
        </section>

        {/* Order Summary */}
        <section className="bg-gray-100 p-6 rounded-xl flex flex-col gap-4">
          <div className="flex justify-between text-xl font-bold">
            <span>Total (before tax)</span>
            <span>${total}</span>
          </div>
        </section>

        {/* Promo Code */}
        <section className="bg-gray-100 p-6 rounded-xl flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">Promo Code</h2>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Enter promo code"
              className="border border-gray-300 rounded-lg px-4 py-3 text-lg flex-1 focus:outline-none"
            />
            <button
              type="button"
              className="rounded-lg px-6 py-3 font-bold text-white bg-red-700 hover:bg-red-600 cursor-pointer"
            >
              Apply
            </button>
          </div>
        </section>

        {/* Payment Form */}
        <section className="bg-gray-100 p-6 rounded-xl flex flex-col gap-6">
          <h2 className="text-2xl font-semibold">Card Details</h2>

          <div className="flex flex-col gap-2">
            <label className="font-medium text-gray-700">Name on Card</label>
            <input
              type="text"
              placeholder="Full name as on card"
              className="border border-gray-300 rounded-lg px-4 py-3 text-lg w-full focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-medium text-gray-700">Card Number</label>
            <input
              type="text"
              placeholder="0000 0000 0000 0000"
              className="border border-gray-300 rounded-lg px-4 py-3 text-lg w-full focus:outline-none tracking-widest"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col gap-2 flex-1">
              <label className="font-medium text-gray-700">Expiry Date</label>
              <input
                type="text"
                placeholder="MM/YY"
                className="border border-gray-300 rounded-lg px-4 py-3 text-lg w-full focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label className="font-medium text-gray-700">CVV</label>
              <input
                type="text"
                placeholder="..."
                className="border border-gray-300 rounded-lg px-4 py-3 text-lg w-full focus:outline-none"
              />
            </div>
          </div>
        </section>

        <button className="ml-auto rounded-3xl px-12 py-4 text-white font-bold bg-red-700 hover:bg-red-600 cursor-pointer">
          Confirm &amp; Pay — ${total}
        </button>
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
