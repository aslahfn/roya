import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    
    // Check global settings for customer app mode
    const modeSetting = await db.settings.findUnique({
      where: { key: 'CUSTOMER_APP_MODE' },
    }).catch(() => null);

    const isPrivateStore = modeSetting?.value === 'PRIVATE';

    const products = await db.product.findMany({
      include: {
        inventory: true,
        pricing: true,
      },
    });

    const isPricingAuthorized = 
      session?.role === 'SUPER_ADMIN' || 
      session?.role === 'PRICING_MANAGER';

    // Format products and redact pricing where necessary
    const formattedProducts = products.map((product) => {
      const { pricing, ...restProduct } = product;

      let redactedPricing = null;

      if (isPricingAuthorized) {
        redactedPricing = pricing;
      } else if (session?.role === 'CUSTOMER' || (!session && !isPrivateStore)) {
        redactedPricing = pricing.map(p => ({
          branchId: p.branchId,
          sellingPrice: p.sellingPrice,
          discountPrice: p.discountPrice,
        }));
      }

      return {
        ...restProduct,
        pricing: redactedPricing,
      };
    });

    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error('Products fetch error', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
