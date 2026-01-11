// import { PrismaClient } from "@prisma/client";

// const db = new PrismaClient({});

// export { db };

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is required");
}

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: databaseUrl,
});

// Create adapter
const adapter = new PrismaPg(pool);

// Create Prisma Client with adapter
const db = new PrismaClient({ adapter });

export { db };
