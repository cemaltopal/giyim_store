import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: "postgresql://postgres.pqztrlrxcdjocgutcyxa:Cobandede.01@aws-0-eu-central-1.pooler.supabase.com:5432/postgres?connect_timeout=30",
  },
});