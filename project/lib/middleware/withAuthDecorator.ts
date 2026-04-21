import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { Session } from "next-auth";

//Used in accountActions as a dectorator
type SessionUser = Session["user"];

// Wraps a Server Action — injects session.user as first arg; returns { error: "Not authenticated" } early if no session.
export function withAuth<TArgs extends unknown[], TReturn>(
  action: (session: SessionUser, ...args: TArgs) => Promise<TReturn>,
): (...args: TArgs) => Promise<TReturn | { error: string }> {
  return async (...args: TArgs) => {
    const session = await auth();
    if (!session) return { error: "Not authenticated" };
    return action(session.user, ...args);
  };
}

//Wraps a Server Action — injects session.user as first arg; returns { error: "Forbidden" } early if no session or role !== "ADMIN".
// adds funcionality to check the session for the ADMIN role
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

// Wraps an API Route handler — injects session.user as first arg; returns 401 early if no session.
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

/** Wraps an API Route handler — injects session.user as first arg; returns 403 early if no session or role !== "ADMIN". */
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
