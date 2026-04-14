import { NextResponse } from "next/server";
import { getShowrooms } from "@/lib/repositories/showroomRepository";

export async function GET() {
  const rows = await getShowrooms();
  return NextResponse.json(rows);
}
