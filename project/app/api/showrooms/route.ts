import { NextResponse } from "next/server";
import * as showroomService from "@/lib/services/showroomService";

export async function GET() {
  const rows = await showroomService.listShowrooms();
  return NextResponse.json(rows);
}
