import MovieDetailsClient from "./MovieDetailsClient";
import Navbar from "@/app/components/Navbar";
import type { movie } from "@/app/types/movie";

function toYouTubeEmbed(url?: string | null): string | null {
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

function getYouTubeId(url: string): string | null {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get("v");
  } catch {
    return null;
  }
}

export default async function MovieDetails({
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
            We couldn’t load details for: <b>{decodeURIComponent(title)}</b>
          </p>
        </main>
      </div>
    );
  }

  const movie: movie = await response.json();

  return (
    <MovieDetailsClient
      movie={movie}
      decodedTitle={decodeURIComponent(title)}
      trailerEmbed={toYouTubeEmbed(movie.trailer_link)}
      youtubeId={getYouTubeId(movie.trailer_link)}
    />
  );
}
