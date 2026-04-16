export type ShowtimeInput = {
  showId: string;
  movieId: number;
  startTime: Date;
  duration: number;
  endTime: Date;
};

export type SeatEntry = {
  showId: string;
  seatIndex: number;
  isAvailable: boolean;
};

export class ShowtimeFactory {
  static createShowtimeInput(
    showId: string,
    movieId: number,
    startTime: Date,
    duration: number,
  ): ShowtimeInput {
    return {
      showId,
      movieId,
      startTime,
      duration,
      endTime: new Date(startTime.getTime() + duration * 60_000),
    };
  }

  static createSeatEntries(showId: string, seatCount: number): SeatEntry[] {
    return Array.from({ length: Math.max(0, seatCount) }, (_, index) => ({
      showId,
      seatIndex: index + 1,
      isAvailable: true,
    }));
  }
}
