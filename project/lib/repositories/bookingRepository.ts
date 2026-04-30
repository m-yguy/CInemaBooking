import { sql } from "@/lib/dbSingleton";

export type TicketQuantities = {
  adult: number;
  child: number;
  senior: number;
};

export type CreateOrderInput = {
  customerId: string;
  showId: string | null;
  movieTitle: string;
  showTime: string;
  selectedSeats: string[];
  quantities: TicketQuantities;
  originalTotal: number;
  discountAmount: number;
  finalTotal: number;
  promoCode: string | null;
  paymentType: "saved" | "new";
  cardLastFour: string | null;
  confirmationEmail: string;
};

export type OrderHistoryItem = {
  orderId: string;
  movieTitle: string;
  showTime: string;
  seats: string[];
  adultTickets: number;
  childTickets: number;
  seniorTickets: number;
  originalTotal: number;
  discountAmount: number;
  finalTotal: number;
  promoCode: string | null;
  paymentType: string;
  cardLastFour: string | null;
  status: string;
  createdAt: string;
  posterUrl: string | null;
};

export async function createOrder(input: CreateOrderInput): Promise<string> {
  const rows = await sql`
    INSERT INTO public.orders (
      customer_id,
      show_id,
      movie_title,
      show_time,
      adult_tickets,
      child_tickets,
      senior_tickets,
      original_total,
      discount_amount,
      final_total,
      promo_code,
      payment_type,
      card_last_four,
      confirmation_email
    )
    VALUES (
      ${input.customerId},
      ${input.showId},
      ${input.movieTitle},
      ${input.showTime},
      ${input.quantities.adult},
      ${input.quantities.child},
      ${input.quantities.senior},
      ${input.originalTotal},
      ${input.discountAmount},
      ${input.finalTotal},
      ${input.promoCode},
      ${input.paymentType},
      ${input.cardLastFour},
      ${input.confirmationEmail}
    )
    RETURNING order_id
  `;

  const orderId = String(rows[0].order_id);

  for (const seat of input.selectedSeats) {
    await sql`
      INSERT INTO public.order_seats (order_id, show_id, seat_number)
      VALUES (${orderId}, ${input.showId}, ${seat})
    `;
  }

  return orderId;
}

export async function getOrderHistory(
  customerId: string,
): Promise<OrderHistoryItem[]> {
  const rows = await sql`
    SELECT
      o.order_id,
      o.movie_title,
      o.show_time,
      o.adult_tickets,
      o.child_tickets,
      o.senior_tickets,
      o.original_total,
      o.discount_amount,
      o.final_total,
      o.promo_code,
      o.payment_type,
      o.card_last_four,
      o.status,
      o.created_at,
      m.trailer_image AS poster_url,
      COALESCE(
        ARRAY_AGG(os.seat_number ORDER BY os.seat_number)
        FILTER (WHERE os.seat_number IS NOT NULL),
        '{}'
      ) AS seats
    FROM public.orders o
    LEFT JOIN public.order_seats os ON os.order_id = o.order_id
    LEFT JOIN public.showtimes st ON st.show_id = o.show_id
    LEFT JOIN public.movies m ON m.movie_id = st.movie_id
    WHERE o.customer_id = ${customerId}
    GROUP BY o.order_id, m.trailer_image
    ORDER BY o.created_at DESC
  `;

  return rows.map((row) => ({
    orderId: String(row.order_id),
    movieTitle: String(row.movie_title),
    showTime: String(row.show_time),
    seats: row.seats as string[],
    adultTickets: Number(row.adult_tickets),
    childTickets: Number(row.child_tickets),
    seniorTickets: Number(row.senior_tickets),
    originalTotal: Number(row.original_total),
    discountAmount: Number(row.discount_amount),
    finalTotal: Number(row.final_total),
    promoCode: row.promo_code ? String(row.promo_code) : null,
    paymentType: String(row.payment_type),
    cardLastFour: row.card_last_four ? String(row.card_last_four) : null,
    status: String(row.status),
    createdAt: String(row.created_at),
    posterUrl: row.poster_url ? String(row.poster_url) : null,
  }));
}

export async function getOrderById(
  orderId: string,
  customerId: string,
): Promise<OrderHistoryItem | null> {
  const rows = await sql`
    SELECT
      o.order_id,
      o.movie_title,
      o.show_time,
      o.adult_tickets,
      o.child_tickets,
      o.senior_tickets,
      o.original_total,
      o.discount_amount,
      o.final_total,
      o.promo_code,
      o.payment_type,
      o.card_last_four,
      o.status,
      o.created_at,
      m.trailer_image AS poster_url,
      COALESCE(
        ARRAY_AGG(os.seat_number ORDER BY os.seat_number)
        FILTER (WHERE os.seat_number IS NOT NULL),
        '{}'
      ) AS seats
    FROM public.orders o
    LEFT JOIN public.order_seats os ON os.order_id = o.order_id
    LEFT JOIN public.showtimes st ON st.show_id = o.show_id
    LEFT JOIN public.movies m ON m.movie_id = st.movie_id
    WHERE o.order_id = ${orderId}
      AND o.customer_id = ${customerId}
    GROUP BY o.order_id, m.trailer_image
    LIMIT 1
  `;

  if (rows.length === 0) return null;

  const row = rows[0];

  return {
    orderId: String(row.order_id),
    movieTitle: String(row.movie_title),
    showTime: String(row.show_time),
    seats: row.seats as string[],
    adultTickets: Number(row.adult_tickets),
    childTickets: Number(row.child_tickets),
    seniorTickets: Number(row.senior_tickets),
    originalTotal: Number(row.original_total),
    discountAmount: Number(row.discount_amount),
    finalTotal: Number(row.final_total),
    promoCode: row.promo_code ? String(row.promo_code) : null,
    paymentType: String(row.payment_type),
    cardLastFour: row.card_last_four ? String(row.card_last_four) : null,
    status: String(row.status),
    createdAt: String(row.created_at),
    posterUrl: row.poster_url ? String(row.poster_url) : null,
  };
}

export async function cancelOrder(
  orderId: string,
  customerId: string,
): Promise<void> {
  await sql`DELETE FROM public.order_seats WHERE order_id = ${orderId}::uuid`;
  await sql`
    DELETE FROM public.orders
    WHERE order_id = ${orderId}::uuid
      AND customer_id = ${customerId}
  `;
}
