import { neon } from "@neondatabase/serverless";

export const sql = neon(process.env.DATABASE_URL!);

async function main() {
  const result = await sql`SELECT 'connected to neon!'`;
  console.log(result);
}

main();