import { NextResponse } from "next/server";
import * as paymentService from "@/lib/services/paymentService";
import type { AddCardInput } from "@/lib/services/paymentService";
import { withAuthRoute } from "@/lib/middleware/withAuth";
import { addCardSchema, removeCardSchema } from "@/lib/schemas/paymentSchema";

export const POST = withAuthRoute(async (session, request) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const parsed = addCardSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 },
    );
  }

  const result = await paymentService.addCard(
    session.id,
    parsed.data as AddCardInput,
  );
  if (!result.ok) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status },
    );
  }

  return NextResponse.json({ success: true });
});

export const DELETE = withAuthRoute(async (session, request) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const parsed = removeCardSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 },
    );
  }

  const result = await paymentService.removeCard(parsed.data.id, session.id);
  if (!result.ok) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status },
    );
  }

  return NextResponse.json({ success: true });
});
