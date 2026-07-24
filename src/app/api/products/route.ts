import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    
    // Check global settings for customer app mode
    const modeSetting = await db.settings.findUnique({
      where: { key: 'CUSTOMER_APP_MODE' },
    });
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
      // Create a base product object without the raw pricing array
      const { pricing, ...restProduct } = product;

      let redactedPricing = null;

      if (isPricingAuthorized) {
        // Authorized admins see all pricing details
        redactedPricing = pricing;
      } else if (session?.role === 'CUSTOMER' || (!session && !isPrivateStore)) {
        // Customers see prices in Public mode, or if they are logged in.
        // They only see sellingPrice, not costPrice or discount structure.
        redactedPricing = pricing.map(p => ({
          branchId: p.branchId,
          sellingPrice: p.sellingPrice,
          discountPrice: p.discountPrice,
        }));
      }
      
      // If none of the above conditions are met, pricing remains completely hidden

      return {
        ...restProduct,
        pricing: redactedPricing, // null if unauthorized
      };
    });

    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error('Products fetch error', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
