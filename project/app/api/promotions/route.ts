import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getAllPromotions } from "@/lib/repositories/promotionRepository";

export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const promotions = await getAllPromotions();
  return NextResponse.json(promotions);
}
