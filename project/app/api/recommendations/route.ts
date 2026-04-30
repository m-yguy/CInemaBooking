import { auth } from "@/auth";
import { getRecommendationsForCustomer } from "@/lib/services/recommendationService";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session || session.user?.role !== "CUSTOMER") {
    return NextResponse.json([], { status: 200 });
  }

  try {
    const movies = await getRecommendationsForCustomer(session.user.id);
    return NextResponse.json(movies);
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to load recommendations." },
      { status: 500 },
    );
  }
}
