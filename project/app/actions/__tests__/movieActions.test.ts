jest.mock("@/auth", () => ({ auth: jest.fn() }));
jest.mock("@/lib/repositories/movieRepository");

import { addMovieAction } from "@/app/actions/movieActions";
import { auth } from "@/auth";
import * as movieRepo from "@/lib/repositories/movieRepository";

const mockAuth = auth as jest.Mock;
const mockAddMovie = movieRepo.addMovie as jest.Mock;

const adminSession = { user: { id: "admin-1", role: "ADMIN" } };

const validInput = {
  title: "Test Movie",
  genres: "Action, Drama",
  synopsis: "A test synopsis.",
  trailer: "https://youtube.com/watch?v=abc",
  trailerImage: "https://example.com/img.jpg",
  mpaaRating: "PG-13",
  releaseStatus: "NOW_PLAYING",
  runtime: 120,
  cast: "Actor One, Actor Two",
  directors: "Director One",
  producers: "Producer One",
};

describe("addMovieAction", () => {
  it("returns Forbidden when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    expect(await addMovieAction(validInput)).toEqual({ error: "Forbidden" });
  });

  it("returns Forbidden for non-ADMIN role", async () => {
    mockAuth.mockResolvedValue({ user: { role: "CUSTOMER" } });
    expect(await addMovieAction(validInput)).toEqual({ error: "Forbidden" });
  });

  it("returns error when title is blank", async () => {
    mockAuth.mockResolvedValue(adminSession);
    expect(await addMovieAction({ ...validInput, title: "   " })).toEqual({
      error: "Title is required.",
    });
  });

  it("returns error when title exceeds 200 characters", async () => {
    mockAuth.mockResolvedValue(adminSession);
    expect(await addMovieAction({ ...validInput, title: "A".repeat(201) })).toEqual({
      error: "Title must be 200 characters or fewer.",
    });
  });

  it("returns error for invalid MPAA rating", async () => {
    mockAuth.mockResolvedValue(adminSession);
    expect(await addMovieAction({ ...validInput, mpaaRating: "X-RATED" })).toEqual({
      error: "Invalid MPAA rating.",
    });
  });

  it("accepts an empty MPAA rating", async () => {
    mockAuth.mockResolvedValue(adminSession);
    mockAddMovie.mockResolvedValue(5);
    expect(await addMovieAction({ ...validInput, mpaaRating: "" })).toEqual({
      success: true,
      movieId: 5,
    });
  });

  it("returns error for invalid release status", async () => {
    mockAuth.mockResolvedValue(adminSession);
    expect(await addMovieAction({ ...validInput, releaseStatus: "RELEASED" })).toEqual({
      error: "Invalid release status.",
    });
  });

  it("returns error when runtime is negative", async () => {
    mockAuth.mockResolvedValue(adminSession);
    expect(await addMovieAction({ ...validInput, runtime: -1 })).toEqual({
      error: "Runtime must be a non-negative whole number (minutes).",
    });
  });

  it("returns error when runtime is a decimal", async () => {
    mockAuth.mockResolvedValue(adminSession);
    expect(await addMovieAction({ ...validInput, runtime: 90.5 })).toEqual({
      error: "Runtime must be a non-negative whole number (minutes).",
    });
  });

  it("returns success with movieId on valid input", async () => {
    mockAuth.mockResolvedValue(adminSession);
    mockAddMovie.mockResolvedValue(42);
    expect(await addMovieAction(validInput)).toEqual({ success: true, movieId: 42 });
  });

  it("returns error when addMovie throws", async () => {
    mockAuth.mockResolvedValue(adminSession);
    mockAddMovie.mockRejectedValue(new Error("DB error"));
    expect(await addMovieAction(validInput)).toEqual({
      error: "Failed to add movie. Please try again.",
    });
  });
});
