import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { cancelOrder, getOrderById } from "@/lib/services/bookingService";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId } = await params;
  const order = await getOrderById(orderId, session.user.id);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  await cancelOrder(orderId, session.user.id);
  return NextResponse.json({ ok: true });
}
