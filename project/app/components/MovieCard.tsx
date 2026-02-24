import type { movie } from "../types/movie";
import Image from "next/image";
import Link from "next/link";

interface MovieCardProps {
  movieData: movie;
}

export default function MovieCard({ movieData }: MovieCardProps) {
  const formatRuntime = (min: number) =>
    `${Math.floor(min / 60)}h ${min % 60}m`;

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div className="flex flex-col m-4 min-w-50">
      <Image
        src={`${movieData.poster_path}`}
        alt={`${movieData.title} Poster`}
        width={200}
        height={0}
      />
      <strong>{movieData.title}</strong>
      <span>
        {formatRuntime(movieData.runtime)} | {movieData.mpa_rating}
      </span>
      <p>{formatDate(movieData.showtime)}</p>
      <button className="bg-red-800 rounded-md p-3 mt-5 font-bold max-w-50 text-white uppercase">
        <Link href="#">Get Tickets</Link>
      </button>
    </div>
  );
}
