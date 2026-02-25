import Navbar from "@/app/components/Navbar";
import type {movie} from "../../types/movie"

export default async function MovieDetails({ params }: { params: Promise<{ title: string }> }) {
    const { title } = await params;


    const response = await fetch(
        `http://localhost:3000/api/test/${(title)}`
    );
    const movie: movie = await response.json();


    return (
        <div>
            <Navbar/>
            <h1>{movie.title}</h1>
        </div>
    )
}