import { NextResponse } from "next/server";
import * as promotionService from "@/lib/services/promotionService";
import { withAuthAdminRoute } from "@/lib/middleware/withAuth";

export const GET = withAuthAdminRoute(async (_session, _request) => {
  const promotions = await promotionService.listPromotions();
  return NextResponse.json(promotions);
});
