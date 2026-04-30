import Navbar from "@/app/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import type { movie } from "@/app/types/movie";
import ShowtimeCard from "@/app/components/ShowtimeCard";

const INVALID_POSTER_PATH = "/Movie_Posters/invalidposter.svg";

const getPosterPath = (posterPath: string | null | undefined) => {
  if (!posterPath || posterPath.trim() === "") {
    return INVALID_POSTER_PATH;
  }

  return posterPath;
};

type Showtime = {
  show_id: string;
  time: string;
  showroom: number;
};

export default async function ShowtimesPage() {
  const moviesResponse = await fetch("http://localhost:3000/api/movieData", {
    cache: "no-store",
  });
  const movies: movie[] = await moviesResponse.json();

  const showtimesResponse = await fetch("http://localhost:3000/api/showtimes", {
    cache: "no-store",
  });
  const showtimesByTitle: Record<string, Showtime[]> =
    await showtimesResponse.json();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-6 py-10 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">
            Showtimes
          </h1>
          <div className="mt-2 h-1 w-16 bg-linear-to-r from-red-600 to-red-400 rounded-full" />
        </div>
        <div className="flex flex-col gap-6">
          {movies
            .filter((m) => (showtimesByTitle[m.title] ?? []).length > 0)
            .map((m) => {
              const showtimes = showtimesByTitle[m.title] ?? [];
              return (
                <div
                  className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl overflow-hidden"
                  key={m.title}
                >
                  <div className="h-1 w-full bg-linear-to-r from-red-600 via-red-500 to-red-600" />
                  <div className="flex flex-row gap-6 p-6">
                    <div className="relative w-24 aspect-2/3 shrink-0">
                      <Image
                        src={getPosterPath(m.poster_path)}
                        alt={`${m.title} poster`}
                        fill
                        loading="eager"
                        sizes="96px"
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex flex-col justify-between w-full">
                      <div>
                        <h2 className="text-xl font-bold text-white uppercase tracking-wide">
                          {m.title}
                        </h2>
                        <p className="text-sm text-neutral-400 mt-1">
                          {m.mpa_rating} &bull; {m.rating}/10
                        </p>
                      </div>
                      <ShowtimeCard
                        movieTitle={m.title}
                        showtimes={showtimes}
                        img={getPosterPath(m.poster_path)}
                      />
                      <Link
                        href={`/movies/${encodeURIComponent(m.title)}`}
                        className="mt-4 inline-block text-sm text-red-400 hover:text-red-300 font-medium transition-colors"
                      >
                        View Movie Details &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </main>
      <footer className="bg-black p-8 text-white text-center items-center">
        <span className="tracking-[0.35em] uppercase">REELHOUSE</span>
      </footer>
    </div>
  );
}
