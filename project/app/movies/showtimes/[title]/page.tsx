import Navbar from "@/app/components/Navbar";
import type { movie } from "../../../types/movie";
import Showtimes from "@/app/components/Showtimes";
import Link from "next/link";
import Image from "next/image";

const SHOWTIMES_BY_TITLE: Record<string, string[]> = {
  DEFAULT: ["2:00 PM", "5:00 PM", "8:00 PM"],
};

export function toYouTubeEmbed(url?: string | null) {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace("/", "");
      return id
        ? `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`
        : null;
    }
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) {
        return `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`;
      }
      if (u.pathname.startsWith("/embed/")) {
        const embedId = u.pathname.split("/embed/")[1]?.split("/")[0];
        return embedId
          ? `https://www.youtube-nocookie.com/embed/${embedId}?rel=0&modestbranding=1`
          : null;
      }
    }
  } catch {
    return null;
  }
  return null;
}

export default async function MovieShowtimes({
  params,
}: {
  params: Promise<{ title: string }>;
}) {
  const { title } = await params;

  const response = await fetch(`http://localhost:3000/api/movieData/${title}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return (
      <div>
        <Navbar />
        <main style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}>
          <h1 style={{ marginBottom: 8 }}>Movie not found</h1>
          <p style={{ opacity: 0.8 }}>
            We couldn&apos;t load details for:{" "}
            <b>{decodeURIComponent(title)}</b>
          </p>
        </main>
      </div>
    );
  }

  const movie: movie = await response.json();

  const decodedTitle = decodeURIComponent(title);

  const posterUrl = movie.poster_path;

  const rating = (movie as movie).rating ?? "NR";
  const description = movie.movie_description ?? "No description available.";

  const trailerLink = (movie as movie).trailer_link as string | undefined;
  const trailerEmbed = toYouTubeEmbed(trailerLink);

  const showtimes =
    SHOWTIMES_BY_TITLE[decodedTitle] || SHOWTIMES_BY_TITLE.DEFAULT;

  return (
    <div>
      <Navbar />

      <Link
        href="/"
        style={{
          display: "inline-block",
          marginBottom: 16,
          padding: "8px 14px",
          borderRadius: 8,
          border: "1px solid rgba(0,0,0,0.2)",
          background: "white",
          fontWeight: 600,
          textDecoration: "none",
          color: "black",
        }}
      >
        ← Back to Home
      </Link>

      <main
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: 24,
          display: "grid",
          gridTemplateColumns: "320px 1fr",
          gap: 24,
        }}
      >
        <section>
          <div
            style={{
              borderRadius: 12,
              overflow: "hidden",
              border: "1px solid rgba(0,0,0,0.1)",
              background: "rgba(0,0,0,0.02)",
            }}
          >
            <div className="relative w-full h-auto">
              <div className="relative w-full aspect-2/3">
                <Image
                  src={posterUrl}
                  alt={`${movie.title} poster`}
                  fill
                  loading="eager"
                  sizes="(max-width: 900px) 100vw, 320px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
          <button className="cursor-pointer py-2 px-4 rounded-md border border-[rgba(0,0,0,0.1)] bg-black text-white font-medium duration-200 transition-all my-2 ">
            <Link href={`/movies/${encodeURIComponent(movie.title)}`}>
              Movie Details
            </Link>
          </button>
        </section>

        <section style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <header>
            <h1 style={{ margin: 0, fontSize: 32, lineHeight: 1.2 }}>
              {movie.title}
            </h1>
            <div style={{ marginTop: 10 }}>
              <span
                style={{
                  padding: "6px 10px",
                  borderRadius: 999,
                  border: "1px solid rgba(0,0,0,0.15)",
                  fontSize: 14,
                }}
              >
                Rating: <b>{rating}</b>
              </span>
            </div>
          </header>

          <div>
            <h2 style={{ margin: "8px 0" }}>Description</h2>
            <p style={{ margin: 0, opacity: 0.9, lineHeight: 1.6 }}>
              {description}
            </p>
          </div>

          <div>
            <h2 style={{ margin: "8px 0" }}>Available showtimes</h2>

            <Showtimes
              movieTitle={movie.title}
              showtimes={showtimes}
              img={movie.poster_path}
            />

            <p style={{ marginTop: 8, opacity: 0.7, fontSize: 13 }}>
              * Showtimes are hardcoded for the assignment.
            </p>
          </div>

          <div>
            {/* <h2 style={{ margin: "8px 0" }}>Trailer</h2> */}

            {trailerEmbed ? (
              <div
                style={{
                  borderRadius: 12,
                  overflow: "hidden",
                  border: "1px solid rgba(0,0,0,0.1)",
                  background: "rgba(0,0,0,0.02)",
                  aspectRatio: "16 / 9",
                  width: "100%",
                }}
              >
                <iframe
                  width="100%"
                  height="100%"
                  src={trailerEmbed}
                  title={`${movie.title} trailer`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ border: 0, display: "block" }}
                />
              </div>
            ) : trailerLink ? (
              <p style={{ margin: 0 }}>
                Trailer link:{" "}
                <a href={trailerLink} target="_blank" rel="noreferrer">
                  Watch trailer
                </a>
              </p>
            ) : (
              <p style={{ margin: 0, opacity: 0.8 }}>
                No trailer available for this movie.
              </p>
            )}
          </div>
        </section>
      </main>

      <style>{`
        @media (max-width: 900px) {
          main {
            grid-template-columns: 1fr !important;
          }
          section:first-child {
            max-width: 420px;
          }
        }
      `}</style>
    </div>
  );
}
