import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const pgAdapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter: pgAdapter });
export default prisma;
