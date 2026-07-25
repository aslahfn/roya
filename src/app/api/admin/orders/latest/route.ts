import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role === 'CUSTOMER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch orders placed in the last 30 minutes
    const recentOrders = await db.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        user: { select: { name: true, email: true, phone: true } },
        items: { include: { product: true } }
      }
    });

    return NextResponse.json({ success: true, orders: recentOrders });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch latest orders' }, { status: 500 });
  }
}
