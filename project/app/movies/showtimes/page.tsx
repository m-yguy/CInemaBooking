import Navbar from "@/app/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import type { movie } from "@/app/types/movie";
import ShowtimeCard from "@/app/components/ShowtimeCard";

const SHOWTIMES_BY_TITLE: Record<string, string[]> = {
  DEFAULT: ["2:00 PM", "5:00 PM", "8:00 PM"],
};

export default async function ShowtimesPage() {
  const response = await fetch("http://localhost:3000/api/movieData", {
    cache: "no-store",
  });

  const movies: movie[] = await response.json();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-6 py-10 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">
            Showtimes
          </h1>
          <div className="mt-2 h-1 w-16 bg-gradient-to-r from-red-600 to-red-400 rounded-full" />
        </div>
        <div className="flex flex-col gap-6">
          {movies.map((m) => {
            const showtimes = SHOWTIMES_BY_TITLE.DEFAULT;

            return (
              <div
                className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl overflow-hidden"
                key={m.title}
              >
                <div className="h-1 w-full bg-gradient-to-r from-red-600 via-red-500 to-red-600" />
                <div className="flex flex-row gap-6 p-6">
                  <div className="relative w-24 aspect-2/3 shrink-0">
                    <Image
                      src={m.poster_path}
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
                      img={m.poster_path}
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
    </div>
  );
}
