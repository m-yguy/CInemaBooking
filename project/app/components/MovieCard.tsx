import type { movie } from "../types/movie";
import Image from "next/image";
import Link from "next/link";

interface MovieCardProps {
  movieData: movie;
}

export default function MovieCard({ movieData }: MovieCardProps) {
  const formatRuntime = (min: number) => `${Math.floor(min / 60)}h ${min % 60}m`;

  const checkReleaseDate = (dateString: string) => {
    const movieDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    movieDate.setHours(0, 0, 0, 0);
    return movieDate < today;
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div className="flex flex-col justify-between mb-6 w-[200px]">
      <div>
        <Link href={`/movies/${encodeURIComponent(movieData.title)}`} className="block">
          <div className="relative w-full aspect-[2/3] overflow-hidden rounded-lg bg-gray-200">
            <Image
              src={movieData.poster_path}
              alt={`${movieData.title} Poster`}
              fill
              sizes="220px"
              className="object-cover"
            />
          </div>

          <h2 className="font-bold leading-tight line-clamp-2 text-[clamp(0.5rem,4vw,1.5rem)] transition-all duration-200 hover:text-[#c8997c]">
            {movieData.title}
          </h2>
        </Link>

        <span className="uppercase text-sm font-semibold">
          {formatRuntime(movieData.runtime)} | {movieData.mpa_rating}
        </span>

        <p className="font-semibold text-sm">
          {movieData.release_status === "Coming Soon"
            ? `Opening ${formatDate(movieData.showtime)}`
            : `Released ${formatDate(movieData.showtime)}`}
        </p>
      </div>

      <Link
        href={`/movies/${encodeURIComponent(movieData.title)}`}
        className="bg-red-700 rounded-4xl mt-6 p-2.5 font-bold text-white uppercase w-full md:max-w-40 hover:bg-black transition-all duration-200 text-center"
      >
        Get Tickets
      </Link>
    </div>
  );
}