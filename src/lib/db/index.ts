import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleHttp } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const rawDatabaseUrl = process.env.DATABASE_URL;

function enforceSsl(url?: string): string | undefined {
  if (!url) return undefined;
  if (url.includes("sslmode=")) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}sslmode=require`;
}

const databaseUrl = enforceSsl(rawDatabaseUrl);

let httpDbInstance: ReturnType<typeof drizzleHttp<typeof schema>> | null = null;

export function getDb() {
  if (!databaseUrl) {
    return null;
  }
  if (!httpDbInstance) {
    try {
      const sql = neon(databaseUrl);
      httpDbInstance = drizzleHttp(sql, { schema });
    } catch (error) {
      console.error("[Database] Gagal menginisialisasi Neon HTTP client:", error);
      httpDbInstance = null;
    }
  }
  return httpDbInstance;
}

export const db = getDb();
export { schema };
export * from "./schema";
