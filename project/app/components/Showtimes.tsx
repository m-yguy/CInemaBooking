"use client";

import { useRouter } from "next/navigation";

export default function Showtimes({
  movieTitle,
  showtimes,
  img,
}: {
  movieTitle: string;
  showtimes: string[];
  img: string;
}) {
  const router = useRouter();

  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
      {showtimes.map((t) => (
        <button
          key={t}
          type="button"
          className="cursor-pointer py-2 px-4 rounded-md border border-[rgba(0,0,0,0.1)] bg-white font-medium hover:bg-black hover:text-white duration-200 transition-all "
          onClick={() => {
            // CHANGE THIS LINE ONCE BOOKING LOGIC IS COMPLETE
            router.push(
              `/booking?title=${encodeURIComponent(movieTitle)}&time=${encodeURIComponent(t)}&poster=${encodeURIComponent(img)}`,
            );
          }}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
