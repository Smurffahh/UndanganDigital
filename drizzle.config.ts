import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url:
      process.env.DATABASE_URL_UNPOOLED ||
      process.env.DATABASE_URL ||
      "postgresql://neondb_owner:npg_MLPk6OmNVe9G@ep-raspy-glade-az45g4yt.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
  },
});
