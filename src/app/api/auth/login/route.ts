import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createSession } from '@/lib/auth';
import type { Role } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password, portalRole } = await req.json();

    const normalizedEmail = (email || '').trim().toLowerCase();

    // Fixed Admin Authentication Requirement
    const isAdminAttempt = 
      portalRole === 'admin' || 
      normalizedEmail === 'royasupermarket.com' || 
      normalizedEmail === 'admin@royasupermarket.com' ||
      normalizedEmail.includes('admin');

    if (isAdminAttempt) {
      const isValidAdmin = 
        (normalizedEmail === 'royasupermarket.com' || normalizedEmail === 'admin@royasupermarket.com') && 
        password === 'roya@123';

      if (!isValidAdmin) {
        return NextResponse.json(
          { error: 'Invalid Administrator Credentials' },
          { status: 401 }
        );
      }

      // Fetch or create Admin user
      let adminUser = await db.user.findFirst({
        where: { role: 'SUPER_ADMIN' },
      });

      if (!adminUser) {
        adminUser = await db.user.create({
          data: {
            email: 'royasupermarket.com',
            name: 'Roya Administrator',
            role: 'SUPER_ADMIN',
            hashedPassword: 'roya@123',
          },
        });
      }

      await createSession({
        userId: adminUser.id,
        role: 'SUPER_ADMIN',
        branchId: adminUser.branchId,
        name: adminUser.name,
      });

      return NextResponse.json({ success: true, role: 'SUPER_ADMIN' });
    }

    // Customer Authentication
    const user = await db.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user || user.hashedPassword !== password) {
      return NextResponse.json({ error: 'Invalid Email or Password' }, { status: 401 });
    }

    await createSession({
      userId: user.id,
      role: user.role as Role,
      branchId: user.branchId,
      name: user.name,
    });

    return NextResponse.json({ success: true, role: user.role });
  } catch (error) {
    console.error('Login error', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
