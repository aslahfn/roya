import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, Email, and Password are required' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Block any attempt to register an admin via public registration API
    if (normalizedEmail.includes('admin') || normalizedEmail.includes('royasupermarket')) {
      return NextResponse.json({ error: 'Admin registration is disabled' }, { status: 403 });
    }

    const existingUser = await db.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered. Please log in.' }, { status: 400 });
    }

    const newUser = await db.user.create({
      data: {
        name,
        email: normalizedEmail,
        phone: phone || null,
        hashedPassword: password,
        role: 'CUSTOMER',
      },
    });

    await createSession({
      userId: newUser.id,
      role: 'CUSTOMER',
      branchId: null,
      name: newUser.name,
    });

    return NextResponse.json({ success: true, user: { id: newUser.id, name: newUser.name, email: newUser.email } });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Failed to create customer account' }, { status: 500 });
  }
}
