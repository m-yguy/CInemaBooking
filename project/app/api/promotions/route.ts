import { NextResponse } from "next/server";
import * as promotionService from "@/lib/services/promotionService";
import { withAuthAdminRoute } from "@/lib/middleware/withAuthDecorator";

export const GET = withAuthAdminRoute(async (_session, _request) => {
  void _session;
  void _request;
  const promotions = await promotionService.listPromotions();
  return NextResponse.json(promotions);
});
