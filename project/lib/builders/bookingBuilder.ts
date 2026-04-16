export type TicketQuantities = {
  adult: number;
  child: number;
  senior: number;
};

export type BookingOrder = {
  title: string;
  time: string;
  posterUrl: string | null;
  showId: string | null;
  selectedSeats: string[];
  quantities: TicketQuantities;
  total: number;
  email?: string;
};

type BuildOptions = {
  requireEmail?: boolean;
};

type ShowInfoInput = {
  title: string | null;
  time: string | null;
  posterUrl: string | null;
  showId: string | null;
};

function isTicketQuantities(value: unknown): value is TicketQuantities {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<TicketQuantities>;
  return (
    typeof candidate.adult === "number" &&
    typeof candidate.child === "number" &&
    typeof candidate.senior === "number"
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object";
}

export class BookingBuilder {
  private showInfo?: ShowInfoInput;
  private selectedSeats?: string[];
  private quantities?: TicketQuantities;
  private total?: number;
  private email?: string;

  setShowInfo(input: ShowInfoInput): BookingBuilder {
    this.showInfo = input;
    return this;
  }

  setSeats(selectedSeats: string[]): BookingBuilder {
    this.selectedSeats = [...selectedSeats].sort();
    return this;
  }

  setTickets(quantities: TicketQuantities): BookingBuilder {
    this.quantities = { ...quantities };
    return this;
  }

  setTotal(total: number): BookingBuilder {
    this.total = total;
    return this;
  }

  setEmail(email: string): BookingBuilder {
    this.email = email.trim();
    return this;
  }

  build(options: BuildOptions = {}): BookingOrder {
    if (!this.showInfo) {
      throw new Error("Booking is incomplete: missing show information.");
    }
    if (!this.showInfo.title || !this.showInfo.time) {
      throw new Error("Booking is incomplete: title and time are required.");
    }
    if (!this.selectedSeats || this.selectedSeats.length === 0) {
      throw new Error("Booking is incomplete: at least one seat is required.");
    }
    if (!this.quantities) {
      throw new Error("Booking is incomplete: ticket quantities are required.");
    }
    if (typeof this.total !== "number" || this.total < 0) {
      throw new Error("Booking is incomplete: total must be a valid number.");
    }
    if (options.requireEmail && !this.email) {
      throw new Error("Booking is incomplete: email is required.");
    }

    const order: BookingOrder = {
      title: this.showInfo.title,
      time: this.showInfo.time,
      posterUrl: this.showInfo.posterUrl,
      showId: this.showInfo.showId,
      selectedSeats: this.selectedSeats,
      quantities: this.quantities,
      total: this.total,
    };

    if (this.email) {
      order.email = this.email;
    }

    return order;
  }

  static fromSerialized(
    serialized: string,
    options: BuildOptions = {},
  ): BookingOrder {
    const decoded = decodeURIComponent(serialized);
    const parsed: unknown = JSON.parse(decoded);

    if (!isRecord(parsed)) {
      throw new Error("Booking payload is invalid.");
    }

    const selectedSeats = parsed.selectedSeats;
    const quantities = parsed.quantities;

    if (
      !Array.isArray(selectedSeats) ||
      !selectedSeats.every((s) => typeof s === "string")
    ) {
      throw new Error(
        "Booking payload is invalid: selected seats are malformed.",
      );
    }
    if (!isTicketQuantities(quantities)) {
      throw new Error(
        "Booking payload is invalid: ticket quantities are malformed.",
      );
    }

    const builder = new BookingBuilder()
      .setShowInfo({
        title: typeof parsed.title === "string" ? parsed.title : null,
        time: typeof parsed.time === "string" ? parsed.time : null,
        posterUrl:
          typeof parsed.posterUrl === "string" ? parsed.posterUrl : null,
        showId: typeof parsed.showId === "string" ? parsed.showId : null,
      })
      .setSeats(selectedSeats)
      .setTickets(quantities)
      .setTotal(typeof parsed.total === "number" ? parsed.total : NaN);

    if (typeof parsed.email === "string") {
      builder.setEmail(parsed.email);
    }

    return builder.build(options);
  }
}
