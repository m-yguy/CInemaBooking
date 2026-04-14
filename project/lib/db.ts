import { neon, NeonQueryFunction } from "@neondatabase/serverless";

declare global {
  var __db: NeonQueryFunction<false, false> | undefined;
}

const db = globalThis.__db ?? neon(process.env.DATABASE_URL!);

if (process.env.NODE_ENV !== "production") {
  globalThis.__db = db;
}

export const sql = db;
