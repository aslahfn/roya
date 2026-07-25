import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { email, newPassword } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email address is required' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Prevent resetting Admin password
    if (normalizedEmail === 'royasupermarket.com' || normalizedEmail === 'admin@royasupermarket.com') {
      return NextResponse.json({ error: 'Admin password cannot be reset automatically.' }, { status: 403 });
    }

    const user = await db.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return NextResponse.json({ error: 'No account found with this email address' }, { status: 404 });
    }

    if (newPassword) {
      await db.user.update({
        where: { id: user.id },
        data: { hashedPassword: newPassword },
      });
      return NextResponse.json({ success: true, message: 'Password updated successfully. Please log in.' });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Password reset link sent to your email address (Simulated).' 
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
