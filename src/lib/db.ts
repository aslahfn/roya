import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';
import { SEED_DB_B64 } from './seed-db-b64';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getDatabaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;

  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    const tmpDbPath = path.join('/tmp', 'dev.db');

    if (!fs.existsSync(tmpDbPath)) {
      try {
        const buffer = Buffer.from(SEED_DB_B64, 'base64');
        fs.writeFileSync(tmpDbPath, buffer);
      } catch (e) {
        console.error('Error hydrating SQLite DB seed:', e);
      }
    }

    if (fs.existsSync(tmpDbPath)) {
      return `file:${tmpDbPath}`;
    }
  }

  const defaultPath = path.join(process.cwd(), 'prisma', 'dev.db');
  return `file:${defaultPath}`;
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
