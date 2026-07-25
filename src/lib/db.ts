import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';
import { SEED_DB_B64 } from './seed-db-b64';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getDatabaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;

  // On Vercel / production serverless functions, ensure /tmp/dev.db exists
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    const tmpDbPath = path.join('/tmp', 'dev.db');

    if (!fs.existsSync(tmpDbPath)) {
      // 1. Try copying from disk candidates
      const candidates = [
        path.join(process.cwd(), 'prisma', 'dev.db'),
        path.join(process.cwd(), 'dev.db'),
        path.join(__dirname, 'dev.db'),
      ];

      let copied = false;
      for (const cand of candidates) {
        if (fs.existsSync(cand)) {
          try {
            fs.copyFileSync(cand, tmpDbPath);
            copied = true;
            break;
          } catch (e) {
            console.error('Error copying candidate:', cand, e);
          }
        }
      }

      // 2. If missing from disk, hydrate from embedded base64 seed
      if (!copied) {
        try {
          const buffer = Buffer.from(SEED_DB_B64, 'base64');
          fs.writeFileSync(tmpDbPath, buffer);
        } catch (e) {
          console.error('Error hydrating embedded SQLite DB seed:', e);
        }
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
