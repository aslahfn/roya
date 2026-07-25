import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createSession } from '@/lib/auth';
import type { Role } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, password, role, portalRole } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, Email, and Password are required' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await db.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered. Please log in.' }, { status: 400 });
    }

    const isTargetAdmin = portalRole === 'admin' || role === 'SUPER_ADMIN' || role === 'admin';
    const assignedRole: Role = isTargetAdmin ? 'SUPER_ADMIN' : 'CUSTOMER';

    const newUser = await db.user.create({
      data: {
        name,
        email: normalizedEmail,
        phone: phone || null,
        hashedPassword: password,
        role: assignedRole,
      },
    });

    await createSession({
      userId: newUser.id,
      role: assignedRole,
      branchId: null,
      name: newUser.name,
    });

    return NextResponse.json({
      success: true,
      role: assignedRole,
      user: { id: newUser.id, name: newUser.name, email: newUser.email, role: assignedRole }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
  }
}
