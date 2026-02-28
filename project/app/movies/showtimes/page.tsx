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
    <div>
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="flex flex-col text-4xl font-bold mb-10 mt-10">
          Showtimes
          <span className="bg-black border-2 mt-2"></span>
        </h1>
        <div className="flex flex-col gap-12">
          {movies.map((m) => {
            const showtimes = SHOWTIMES_BY_TITLE.DEFAULT;

            return (
              <div className="flex flex-col" key={m.title}>
                <div className="flex flex-row gap-6 pb-10">
                  {/* Poster */}
                  <div className="relative w-32 aspect-2/3 shrink-0">
                    <Image
                      src={m.poster_path}
                      alt={`${m.title} poster`}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  {/* Movie Info */}
                  <div className="flex flex-col justify-between w-full">
                    <div>
                      <h2 className="text-2xl font-bold uppercase">
                        {m.title}
                      </h2>
                      <p className="text-sm opacity-80 mt-1">
                        {m.mpa_rating} • {m.rating}/10
                      </p>
                    </div>
                    {/* Showtimes */}
                    <ShowtimeCard
                      movieTitle={m.title}
                      showtimes={showtimes}
                      img={m.poster_path}
                    />
                    <Link
                      href={`/movies/${encodeURIComponent(m.title)}`}
                      className="mt-4 inline-block text-sm text-red-600 hover:underline"
                    >
                      View Movie Details →
                    </Link>
                  </div>
                </div>
                <span className="border-2 bg-blacks"></span>
              </div>
            );
          })}
        </div>
      </main>
      <footer className="bg-black p-8 text-white text-center items-center">
        <span className="text-black">Footer</span>
      </footer>
    </div>
  );
}
