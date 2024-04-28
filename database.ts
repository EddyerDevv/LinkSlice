import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

const createPrismaClient = () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaNeon(pool);

  return new PrismaClient({
    adapter,
  });
};

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

const db = globalForPrisma.prisma ?? createPrismaClient();
export default db;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
