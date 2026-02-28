"use client";

import Link from "next/link";

interface ShowtimeCardProps {
  movieTitle: string;
  showtimes: string[];
  img: string;
}

export default function ShowtimeCard({
  movieTitle,
  showtimes,
  img,
}: ShowtimeCardProps) {
  return (
    <div className="flex flex-wrap gap-3 mt-2">
      {showtimes.length > 0 ? (
        showtimes.map((time) => (
          <Link
            key={time}
            href={`/booking?title=${encodeURIComponent(movieTitle)}
              &time=${encodeURIComponent(time)}
              &poster=${encodeURIComponent(img)}`}
            className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-black transition-all duration-200"
          >
            {time}
          </Link>
        ))
      ) : (
        <p className="text-sm opacity-70">No showtimes available.</p>
      )}
    </div>
  );
}
