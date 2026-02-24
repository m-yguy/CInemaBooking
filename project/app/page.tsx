import Navbar from "./components/Navbar";
import MovieCard from "./components/MovieCard";

export default function Home() {
  const tempMovieData = {
    title: "28 Years Later",
    genre: "Horror/Thriller",
    rating: 8.8,
    description:
      "It's been almost three decades since the rage virus escaped from a biological weapons laboratory. Still living in a ruthlessly enforced quarantine, some have found ways to exist amid the infected. One such group of survivors lives on a small island connected to the mainland by a single, heavily defended causeway. When one of them decides to venture into the dark heart of the mainland, he soon discovers a mutation that has spread to not only the infected, but other survivors as well.",
    poster_path: "/Movie_Posters/28YearsLater.jpg",
    showtime: "2026-05-01 19:30:00",
    trailer_link: "https://www.youtube.com/watch?v=IYGG55qwQZQ",
    release_status: "Now Playing",
    mpa_rating: "R",
    cast: "Jodie Corner, Alfie Williams, Aaron Taylor-Johnson, Ralph Fiennes",
    director: "Danny Boyle",
    producer: "Danny Boyle, Alex Garland, Andrew Macdonald",
    runtime: 115,
  };
  //This is currently using this dummy data, ideally I assume we'll just loop through the fetched data and display them all

  return (
    <div className="flex flex-col overflow-hidden">
      <Navbar />
      <main className="">
        <div className="bg-black">hero</div>
        <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
          <MovieCard movieData={tempMovieData} />
          <MovieCard movieData={tempMovieData} />
          <MovieCard movieData={tempMovieData} />
          <MovieCard movieData={tempMovieData} />
          <MovieCard movieData={tempMovieData} />
          <MovieCard movieData={tempMovieData} />
          <MovieCard movieData={tempMovieData} />
          <MovieCard movieData={tempMovieData} />
        </div>
      </main>
    </div>
  );
}
