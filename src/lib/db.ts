import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import path from 'path';
import fs from 'fs';
import { SEED_DB_B64 } from './seed-db-b64';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getDbFilePath(): string {
  if (process.env.VERCEL) {
    const tmpDbPath = path.join('/tmp', 'dev.db');
    if (!fs.existsSync(tmpDbPath)) {
      try {
        const buffer = Buffer.from(SEED_DB_B64, 'base64');
        fs.writeFileSync(tmpDbPath, buffer);
      } catch (e) {
        console.error('Error hydrating SQLite seed:', e);
      }
    }
    return tmpDbPath;
  }
  return path.join(process.cwd(), 'prisma', 'dev.db');
}

function createPrismaClient(): PrismaClient {
  const dbPath = getDbFilePath();
  const fileUrl = `file:${dbPath}`;

  try {
    const adapter = new PrismaLibSql({ url: fileUrl } as any);
    return new PrismaClient({ adapter } as any);
  } catch (err) {
    return new PrismaClient({
      datasources: {
        db: {
          url: fileUrl,
        },
      },
    });
  }
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
