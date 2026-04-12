"use client";

import Link from "next/link";

type Showtime = {
  show_id: string;
  time: string;
};

interface ShowtimeCardProps {
  movieTitle: string;
  showtimes: Showtime[];
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
        showtimes.map((showtime) => (
          <Link
            key={showtime.show_id}
            href={`/booking?title=${encodeURIComponent(movieTitle)}&time=${encodeURIComponent(showtime.time)}&poster=${encodeURIComponent(img)}&showId=${showtime.show_id}`}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors duration-150"
          >
            {showtime.time}
          </Link>
        ))
      ) : (
        <p className="text-sm opacity-70">No showtimes available.</p>
      )}
    </div>
  );
}
