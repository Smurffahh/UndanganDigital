import { neon, Pool } from "@neondatabase/serverless";
import { drizzle as drizzleHttp } from "drizzle-orm/neon-http";
import { drizzle as drizzleServerless } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;
const unpooledDatabaseUrl = process.env.DATABASE_URL_UNPOOLED;

/**
 * Cek apakah kredensial database Neon Postgres telah terkonfigurasi.
 */
export function isDatabaseConfigured(): boolean {
  return Boolean(databaseUrl && databaseUrl.trim().length > 0);
}

// 1. Neon HTTP Client (Zero cold-start overhead, highly resilient for Serverless App Router)
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

// 2. Neon WebSocket / Connection Pool Client (Untuk transaksi interaktif jika diperlukan)
let poolInstance: Pool | null = null;
let pooledDbInstance: ReturnType<typeof drizzleServerless<typeof schema>> | null = null;

export function getPooledDb() {
  const connString = unpooledDatabaseUrl || databaseUrl;
  if (!connString) {
    return null;
  }
  if (!pooledDbInstance) {
    try {
      poolInstance = new Pool({ connectionString: connString });
      pooledDbInstance = drizzleServerless(poolInstance, { schema });
    } catch (error) {
      console.error("[Database] Gagal menginisialisasi Neon Pooled client:", error);
      pooledDbInstance = null;
    }
  }
  return pooledDbInstance;
}

// Default runtime instance
export const db = getDb();
export { schema };
export * from "./schema";
