"use client";

import Navbar from "@/app/components/Navbar";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useRef, useEffect, Suspense } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";

type Seat = {
  show_seat_id: number;
  seat_number: string;
  is_available: boolean;
};

function BookingContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();

  const title = searchParams.get("title");
  const time = searchParams.get("time");
  const posterUrl = searchParams.get("poster");
  const showId = searchParams.get("showId");

  const [seats, setSeats] = useState<Seat[]>([]);
  const [loadingSeats, setLoadingSeats] = useState(true);

  useEffect(() => {
    if (!showId) {
      setLoadingSeats(false)
      return;
    }

    fetch(`/api/seats?showId=${showId}`)
      .then((response) => response.json())
      .then((data) => {
        setSeats(data);
        setLoadingSeats(false);
      });
  }, [showId]);


  const seatsByRow: Record<string, Seat[]> = {};
  for (const seat of seats) {
    const rowLetter = seat.seat_number.charAt(0);
    if (!seatsByRow[rowLetter]) {
      seatsByRow[rowLetter] = [];
    }
    seatsByRow[rowLetter].push(seat);
  }

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

  let buttonColor = "bg-gray-400 cursor-not-allowed";
  if (seatCount > 0 && totalTickets === seatCount) buttonColor = "bg-red-700 hover:bg-red-600 cursor-pointer";

  function goToCheckout() {
    const checkoutData = {
      title,
      time,
      posterUrl,
      showId,
      selectedSeats: selectedSeats.sort(),
      quantities,
      total,
    };
    const encoded = encodeURIComponent(JSON.stringify(checkoutData));

    // If not logged in, redirect to sign in page and come back after
    if (!session) {
      const checkoutUrl = `/checkout?data=${encoded}`;
      router.push(`/signin?callbackUrl=${encodeURIComponent(checkoutUrl)}`);
      return;
    }

    router.push(`/checkout?data=${encoded}`);
  }

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
            {loadingSeats ? (
              <p className="text-center text-gray-500">Loading seats...</p>
            ) : (
              Object.keys(seatsByRow).sort().map((rowLetter) => (
                <div key={rowLetter} className="flex justify-center gap-2">
                  {seatsByRow[rowLetter].map((seat) => {
                    const selected = selectedSeats.includes(seat.seat_number);

                    let seatColor = "bg-gray-400 hover:bg-gray-300";
                    if (!seat.is_available) seatColor = "bg-gray-700 text-gray-500 cursor-not-allowed";
                    if (selected) seatColor = "bg-red-600 text-white";

                    return (
                      <div
                        key={seat.show_seat_id}
                        onMouseDown={() => { if (seat.is_available) toggleSeat(seat.seat_number); }}
                        onMouseEnter={() => { if (seat.is_available) handleDragSeat(seat.seat_number); }}
                        className={`w-9 h-9 rounded text-sm font-medium flex items-center justify-center cursor-pointer transition-all ${seatColor}`}
                      >
                        {seat.seat_number}
                      </div>
                    );
                  })}
                </div>
              ))
            )}
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
                    className="w-8 h-8 rounded-full bg-gray-300 hover:bg-gray-400 text-black flex items-center justify-center text-xl leading-0"
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
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xl leading-0
                      ${totalTickets < seatCount
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

        <button
          onClick={goToCheckout}
          disabled={seatCount === 0 || totalTickets !== seatCount}
          className={`ml-auto rounded-3xl px-12 py-4 text-white font-bold ${buttonColor}`}
        >
          Proceed to Checkout
        </button>

      </main>

      <footer className="bg-black p-8 text-white text-center items-center">
        <span className="text-black">Footer</span>
      </footer>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <BookingContent />
    </Suspense>
  );
}
