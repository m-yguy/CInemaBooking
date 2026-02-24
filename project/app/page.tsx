"use client"
import Navbar from "./components/Navbar";
import MovieCard from "./components/MovieCard";
import { useEffect, useState } from "react";
import { movie } from "./types/movie";

export default function Home() {

  const [movies, setMovies] = useState<movie[]>([]);
  useEffect(() => {
    fetch("/api/test")
      .then(res => res.json())
      .then(data => setMovies(data))
  }, [])


  return (
    <div className="flex flex-col overflow-hidden">
      <Navbar />
      <main className="">
        <div className="bg-black">hero</div>
        <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
          {movies.map((movie) => (
            <MovieCard key={movie.title} movieData={movie}/>
          ))}
        </div>
      </main>
    </div>
  );
}
