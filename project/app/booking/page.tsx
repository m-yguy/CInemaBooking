"use client";

import Navbar from "@/app/components/Navbar";
import { useSearchParams } from "next/navigation";
import { useState, useRef } from "react";
import Image from "next/image";

export default function BookingPage() {
  const searchParams = useSearchParams();
  const title = searchParams.get("title");
  const time = searchParams.get("time");
  const posterUrl = searchParams.get("poster");

  const prices = { adult: 12, child: 8, senior: 10 };

  const [quantities, setQuantities] = useState({
    adult: 0,
    child: 0,
    senior: 0,
  });

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const isDragging = useRef(false);

  const seatCount = selectedSeats.length;
  const totalTickets = quantities.adult + quantities.child + quantities.senior;

  // 8 rows theater
  const baseRows = [
    { row: "A", seats: 10 },
    { row: "B", seats: 12 },
    { row: "C", seats: 14 },
    { row: "D", seats: 12 },
  ];

  const allRows = [
    ...baseRows,
    ...baseRows.map((r, i) => ({
      row: String.fromCharCode(69 + i), // E–H
      seats: r.seats,
    })),
  ];

  const toggleSeat = (seatId: string) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((s) => s !== seatId)
        : [...prev, seatId],
    );
  };

  const handleDragSeat = (seatId: string) => {
    if (!isDragging.current) return;
    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev : [...prev, seatId],
    );
  };

  const changeQuantity = (type: keyof typeof quantities, delta: number) => {
    setQuantities((prev) => {
      const newValue = prev[type] + delta;

      if (newValue < 0) return prev;

      // ticket limit
      if (delta > 0 && totalTickets >= seatCount) return prev;

      return { ...prev, [type]: newValue };
    });
  };

  const total =
    quantities.adult * prices.adult +
    quantities.child * prices.child +
    quantities.senior * prices.senior;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-6 w-full mt-24 mb-16 flex flex-col gap-10">
        {/* Title */}
        <div>
          <h1 className="text-4xl font-bold">Book Tickets</h1>
          <span className="block border-b-4 border-black mt-2"></span>
        </div>

        {/* Movie Info */}
        <section className="bg-black text-white p-6 rounded-xl shadow-sm flex flex-row">
          {posterUrl && (
            <div className="relative w-40 aspect-2/3 rounded-lg overflow-hidden shadow-md">
              <Image
                src={posterUrl}
                alt={`${title} poster`}
                fill
                loading="eager"
                sizes="160px"
                className="object-cover"
              />
            </div>
          )}
          <div className="mt-auto ml-4">
            <h2 className="text-2xl font-semibold mb-4">Movie Details</h2>
            <p className="text-lg">
              <span className="font-semibold">Movie:</span> {title}
            </p>
            <p className="text-lg mt-1">
              <span className="font-semibold">Showtime:</span> {time}
            </p>
          </div>
        </section>

        {/* Seat Selection */}
        <section className="bg-gray-100 p-6 rounded-xl shadow-sm select-none">
          <h2 className="text-2xl font-semibold mb-4">Select Seats</h2>

          {/* Curved Screen */}
          <div className="flex flex-col items-center mb-6">
            <div
              className="w-64 h-4 bg-gray-300 rounded-full shadow-inner"
              style={{
                borderBottomLeftRadius: "50%",
                borderBottomRightRadius: "50%",
              }}
            ></div>
            <div className="text-center text-gray-600 font-medium mt-2">
              Screen
            </div>
          </div>

          {/* Seat Rows */}
          <div
            className="flex flex-col items-center gap-4"
            onMouseDown={() => (isDragging.current = true)}
            onMouseUp={() => (isDragging.current = false)}
            onMouseLeave={() => (isDragging.current = false)}
          >
            {allRows.map(({ row, seats }) => (
              <div
                key={row}
                className="flex justify-center gap-2"
                style={{ transform: `scale(${1 + (seats - 10) * 0.03})` }}
              >
                {Array.from({ length: seats }).map((_, i) => {
                  const seatId = `${row}${i + 1}`;
                  const selected = selectedSeats.includes(seatId);

                  return (
                    <div
                      key={seatId}
                      onMouseDown={() => toggleSeat(seatId)}
                      onMouseEnter={() => handleDragSeat(seatId)}
                      className={`w-9 h-9 rounded text-sm font-medium flex items-center justify-center cursor-pointer transition-all
                        ${
                          selected
                            ? "bg-red-600 text-white"
                            : "bg-gray-400 hover:bg-gray-300"
                        }
                      `}
                    >
                      {seatId}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Seat Counter */}
          <p className="text-lg font-semibold mt-4 text-center">
            Seats selected: {seatCount}
          </p>

          {/* Selected Seats List */}
          {selectedSeats.length > 0 && (
            <p className="text-center text-gray-700 mt-2">
              Selected:{" "}
              <span className="font-semibold">
                {selectedSeats.sort().join(", ")}
              </span>
            </p>
          )}
        </section>

        {/* Ticket Selection */}
        <section className="bg-gray-100 p-6 rounded-xl shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Select Tickets</h2>

          <p className="text-gray-700 mb-4">
            Total tickets cannot exceed seats selected.
          </p>

          <div className="flex flex-col gap-6">
            {Object.keys(prices).map((type) => (
              <div key={type} className="flex justify-between items-center">
                <p className="capitalize font-medium text-lg">
                  {type} — ${prices[type as keyof typeof prices]}
                </p>

                <div className="flex items-center gap-3">
                  {/* Minus Button */}
                  <button
                    onClick={() =>
                      changeQuantity(type as keyof typeof quantities, -1)
                    }
                    className="w-8 h-8 rounded-full bg-gray-300 hover:bg-gray-400 text-black flex items-center text-center justify-center text-xl"
                  >
                    –
                  </button>

                  {/* Quantity */}
                  <span className="text-lg font-semibold w-6 text-center text-black">
                    {quantities[type as keyof typeof quantities]}
                  </span>

                  {/* Plus Button */}
                  <button
                    onClick={() =>
                      changeQuantity(type as keyof typeof quantities, 1)
                    }
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xl
                      ${
                        totalTickets < seatCount
                          ? "bg-gray-300 hover:bg-gray-400 text-black"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }
                    `}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-xl font-bold">Total: ${total}</div>
        </section>

        <button className="ml-auto rounded-3xl bg-red-700 px-12 py-4 text-white font-bold ">
          Checkout
        </button>
      </main>

      <footer className="bg-black p-8 text-white text-center items-center">
        <span className="text-black">Footer</span>
      </footer>
    </div>
  );
}
