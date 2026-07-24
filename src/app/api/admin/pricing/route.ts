import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    
    // Safety check - middleware should already protect this, but good to be sure
    if (session?.role !== 'SUPER_ADMIN' && session?.role !== 'PRICING_MANAGER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const pricing = await db.pricing.findMany({
      include: {
        product: {
          select: { name: true, sku: true }
        },
        branch: {
          select: { name: true }
        }
      }
    });

    return NextResponse.json(pricing);
  } catch (error) {
    console.error('Pricing fetch error', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    
    if (session?.role !== 'SUPER_ADMIN' && session?.role !== 'PRICING_MANAGER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const data = await req.json();
    const { productId, branchId, costPrice, sellingPrice, discountPrice, reason } = data;

    // Update pricing
    const updatedPricing = await db.pricing.upsert({
      where: {
        productId_branchId: { productId, branchId }
      },
      update: { costPrice, sellingPrice, discountPrice },
      create: { productId, branchId, costPrice, sellingPrice, discountPrice }
    });

    // Record audit log
    await db.priceAuditLog.create({
      data: {
        userId: session.userId,
        productId,
        branchId,
        oldPrice: null, // Should fetch old price ideally
        newPrice: sellingPrice,
        reason: reason || 'Manual Update',
      }
    });

    return NextResponse.json({ success: true, data: updatedPricing });
  } catch (error) {
    console.error('Pricing update error', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
