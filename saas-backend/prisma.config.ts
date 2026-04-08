import "dotenv/config";
// Import the env helper
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Use Prisma's native env() helper instead of process.env
    url: env("DATABASE_URL"),
  },
});