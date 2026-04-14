import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { Session } from "next-auth";

type SessionUser = Session["user"];

/** Decorator: injects session into Server Actions; rejects unauthenticated callers. */
export function withAuth<TArgs extends unknown[], TReturn>(
  action: (session: SessionUser, ...args: TArgs) => Promise<TReturn>,
): (...args: TArgs) => Promise<TReturn | { error: string }> {
  return async (...args: TArgs) => {
    const session = await auth();
    if (!session) return { error: "Not authenticated" };
    return action(session.user, ...args);
  };
}

/** Decorator: injects session into Server Actions; rejects non-ADMIN callers. */
export function withAuthAdmin<TArgs extends unknown[], TReturn>(
  action: (session: SessionUser, ...args: TArgs) => Promise<TReturn>,
): (...args: TArgs) => Promise<TReturn | { error: string }> {
  return async (...args: TArgs) => {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN")
      return { error: "Forbidden" };
    return action(session.user, ...args);
  };
}

/** Decorator: injects session into API Route handlers; rejects unauthenticated callers. */
export function withAuthRoute<TReturn extends Response>(
  handler: (session: SessionUser, request: Request) => Promise<TReturn>,
): (request: Request) => Promise<TReturn | NextResponse> {
  return async (request: Request) => {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return handler(session.user, request);
  };
}

/** Decorator: injects session into API Route handlers; rejects non-ADMIN callers. */
export function withAuthAdminRoute<TReturn extends Response>(
  handler: (session: SessionUser, request: Request) => Promise<TReturn>,
): (request: Request) => Promise<TReturn | NextResponse> {
  return async (request: Request) => {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return handler(session.user, request);
  };
}
