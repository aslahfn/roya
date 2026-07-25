import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role === 'CUSTOMER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const {
      name,
      sku,
      category,
      brand,
      unit,
      sellingPrice,
      costPrice,
      stockQuantity,
      minStock,
      maxStock,
      supplier,
      expiryDate,
      purchaseDate,
      images
    } = body;

    const branch = await db.branch.findFirst();
    const branchId = branch?.id || 'branch-hq';

    const product = await db.product.create({
      data: {
        name,
        sku: sku || `SKU-${Date.now()}`,
        category,
        brand: brand || 'Roya Supermarket',
        unit: unit || 'Piece',
        minStock: minStock || 5,
        maxStock: maxStock || 500,
        supplier: supplier || null,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
        images: images || '/logo.jpg',
      }
    });

    // Create Pricing
    await db.pricing.create({
      data: {
        productId: product.id,
        branchId,
        costPrice: costPrice || 1.0,
        sellingPrice: sellingPrice || 2.0,
      }
    });

    // Create Inventory
    await db.productBranch.create({
      data: {
        productId: product.id,
        branchId,
        stockQuantity: stockQuantity || 50,
      }
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
