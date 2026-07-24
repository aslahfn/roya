import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createSession } from '@/lib/auth';
import type { Role } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password, role } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Email is already registered' }, { status: 400 });
    }

    // In a real app, hash the password!
    const user = await db.user.create({
      data: {
        email,
        hashedPassword: password,
        name: email.split('@')[0], // placeholder name
        role: role || 'CUSTOMER'
      }
    });

    await createSession({
      userId: user.id,
      role: user.role as Role,
      branchId: user.branchId,
      name: user.name
    });

    return NextResponse.json({ success: true, role: user.role, hasProfile: false });
  } catch (error) {
    console.error('Registration error', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
