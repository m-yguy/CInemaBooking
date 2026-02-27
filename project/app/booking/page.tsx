"use client";


// import statments

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react"; 

export default function BookingPage() {
  const searchParams = useSearchParams();
  const title = searchParams.get("title");
  const time = searchParams.get("time");


  //ticket prices, lmk if we want to go with something different here

  const prices = {
    adult: 12,
    child: 8,
    senior: 10,
  };


//quanittiees for the tickets

  const [quantities, setQuantities] = useState({
    adult: 0,
    child: 0,
    senior: 0,
  });

  //selected seats

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const handleQuantityChange = (type: string, value: number) => {
    setQuantities({ ...quantities, [type]: value });
  };

  //total number of tickets selected
  const totalTickets =
    quantities.adult + quantities.child + quantities.senior;

  const toggleSeat = (seatId: string) => {
    //allow deselecting seats
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
      return;
    }

    //prevent selecting more seats than tickets
    if (selectedSeats.length >= totalTickets) {
      return;
    }

    setSelectedSeats([...selectedSeats, seatId]);
  };

  //if ticket quantity decreases, trim selected seats
  useEffect(() => {
    if (selectedSeats.length > totalTickets) {
      setSelectedSeats(selectedSeats.slice(0, totalTickets));
    }
  }, [totalTickets]);

  //ticket total pricing logic
  const total =
    quantities.adult * prices.adult +
    quantities.child * prices.child +
    quantities.senior * prices.senior;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-4">Booking Page</h1>

      <div className="mb-6">
        <p className="text-lg">
          <span className="font-semibold">Movie:</span> {title}
        </p>
        <p className="text-lg">
          <span className="font-semibold">Showtime:</span> {time}
        </p>
      </div>

      {/* Ticket section for the selecting portion */}

      <div className="bg-gray-800 p-6 rounded-xl mb-8">
        <h2 className="text-xl font-semibold mb-4">Select Tickets</h2>

        {Object.keys(prices).map((type) => (
          <div key={type} className="flex justify-between items-center mb-4">
            <div>
              <p className="capitalize font-medium">
                {type} - ${prices[type as keyof typeof prices]}
              </p>
            </div>
            <input
              type="number"
              min="0"
              value={quantities[type as keyof typeof quantities]}
              onChange={(e) =>
                handleQuantityChange(type, Number(e.target.value))
              }
              className="w-20 text-black rounded p-1"
            />
          </div>
        ))}

        <div className="mt-4 text-lg font-bold">
          Total: ${total}
        </div>
      </div>

      {/* layouts of the seats */}
      <div className="bg-gray-800 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">Select Seats</h2>

        {/* warning message if seat limit reached */}
        {totalTickets > 0 && selectedSeats.length >= totalTickets && (
          <p className="text-red-400 mb-3">
            You cannot select more seats than tickets.
          </p>
        )}

        <div className="mb-4 text-center text-gray-400">
          Screen
        </div>

        <div className="grid gap-2 justify-center">
          {Array.from({ length: 6 }).map((_, row) => (
            <div key={row} className="flex gap-2 justify-center">
              {Array.from({ length: 8 }).map((_, seat) => {
                const seatId = `${String.fromCharCode(65 + row)}${seat + 1}`;
                const selected = selectedSeats.includes(seatId);

                return (
                  <button
                    key={seatId}
                    onClick={() => toggleSeat(seatId)}
                    className={`w-8 h-8 rounded ${
                      selected
                        ? "bg-green-500"
                        : "bg-gray-500 hover:bg-gray-400"
                    }`}
                  >
                    {seatId}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}