import { neon, NeonQueryFunction } from "@neondatabase/serverless";

declare global {
  var __db: NeonQueryFunction<false, false> | undefined;
}

class DatabaseConnection {
  private static instance: NeonQueryFunction<false, false> | undefined;

  private constructor() {}

  public static getInstance(): NeonQueryFunction<false, false> {
    if (DatabaseConnection.instance) {
      return DatabaseConnection.instance;
    }

    const db = globalThis.__db ?? neon(process.env.DATABASE_URL!);
    if (process.env.NODE_ENV !== "production") {
      globalThis.__db = db;
    }

    DatabaseConnection.instance = db;
    return db;
  }
}

export const sql = DatabaseConnection.getInstance();
