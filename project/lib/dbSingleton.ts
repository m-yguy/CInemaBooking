import { neon, NeonQueryFunction } from "@neondatabase/serverless";

declare global {
  var __db: NeonQueryFunction<false, false> | undefined;
}

// Singleton pattern — reuse one db connection instance across hot-reloads in development
const db = globalThis.__db ?? neon(process.env.DATABASE_URL!);

if (process.env.NODE_ENV !== "production") {
  globalThis.__db = db;
}

export const sql = db;
