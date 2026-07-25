import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getDatabaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;

  const sourceDbPath = path.join(process.cwd(), 'prisma', 'dev.db');

  // On Vercel serverless functions, copy dev.db to /tmp so SQLite can open & write
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    const tmpDbPath = path.join('/tmp', 'dev.db');
    try {
      if (fs.existsSync(sourceDbPath) && !fs.existsSync(tmpDbPath)) {
        fs.copyFileSync(sourceDbPath, tmpDbPath);
      }
    } catch (err) {
      console.error('SQLite /tmp copy notice:', err);
    }
    if (fs.existsSync(tmpDbPath)) {
      return `file:${tmpDbPath}`;
    }
  }

  return `file:${sourceDbPath}`;
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
