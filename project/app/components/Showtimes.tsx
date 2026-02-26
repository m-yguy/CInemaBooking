"use client";

import { useRouter } from "next/navigation";

export default function Showtimes({
  movieTitle,
  showtimes,
}: {
  movieTitle: string;
  showtimes: string[];
}) {
  const router = useRouter();

  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
      {showtimes.map((t) => (
        <button
          key={t}
          type="button"
          style={{
            cursor: "pointer",
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid rgba(0,0,0,0.2)",
            background: "white",
            fontWeight: 600,
          }}
          onClick={() => {
            router.push(
              `/booking?title=${encodeURIComponent(movieTitle)}&time=${encodeURIComponent(
                t
              )}`
            );
          }}
        >
          {t}
        </button>
      ))}
    </div>
  );
}