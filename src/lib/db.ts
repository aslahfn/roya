import { PrismaClient } from '@prisma/client';
import path from 'path';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Compute absolute fallback path to prisma/dev.db for Vercel Serverless Functions
const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
const dbUrl = process.env.DATABASE_URL || `file:${dbPath}`;

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: dbUrl,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
