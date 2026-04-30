import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import { getOrderById } from "@/lib/repositories/bookingRepository";
import Image from "next/image";

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signin");
  }

  const { orderId } = await params;
  const order = await getOrderById(orderId, session.user.id);

  if (!order) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      <main className="mx-auto w-full max-w-4xl px-6 pt-28 pb-16">
        <a
          href="/account"
          className="mb-8 inline-block text-sm font-semibold text-red-800 hover:underline"
        >
          ← Back to Account
        </a>

        <h1 className="mb-8 text-4xl font-bold">Order Details</h1>

        <div className="grid gap-8 md:grid-cols-[220px_1fr]">
          <div className="relative aspect-2/3 overflow-hidden rounded-xl bg-gray-200 shadow">
            {order.posterUrl ? (
              <Image
                src={order.posterUrl}
                alt={order.movieTitle}
                fill
                sizes="220px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-500">
                No Poster
              </div>
            )}
          </div>

          <section className="rounded-xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="mb-4 text-2xl font-bold">{order.movieTitle}</h2>

            <div className="space-y-3 text-gray-700">
              <p>
                <span className="font-semibold text-black">Showtime:</span>{" "}
                {order.showTime}
              </p>

              <p>
                <span className="font-semibold text-black">Seats:</span>{" "}
                {order.seats.join(", ")}
              </p>

              <p>
                <span className="font-semibold text-black">Tickets:</span>{" "}
                Adult {order.adultTickets}, Child {order.childTickets}, Senior{" "}
                {order.seniorTickets}
              </p>

              {order.discountAmount > 0 && (
                <>
                  <p>
                    <span className="font-semibold text-black">
                      Original Total:
                    </span>{" "}
                    ${order.originalTotal.toFixed(2)}
                  </p>

                  <p className="text-green-700">
                    <span className="font-semibold">Promo Discount:</span> -$
                    {order.discountAmount.toFixed(2)}{" "}
                    {order.promoCode ? `(${order.promoCode})` : ""}
                  </p>
                </>
              )}

              <p className="text-xl font-bold text-black">
                Final Total: ${order.finalTotal.toFixed(2)}
              </p>

              {order.cardLastFour && (
                <p>
                  <span className="font-semibold text-black">Payment:</span>{" "}
                  {order.paymentType} card ending in {order.cardLastFour}
                </p>
              )}

              <p>
                <span className="font-semibold text-black">Status:</span>{" "}
                {order.status}
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}