'use server';

import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function createProduct(formData: FormData) {
  const session = await getSession();
  
  if (!session || (session.role === 'CUSTOMER')) {
    throw new Error('Unauthorized');
  }

  const name = formData.get('name') as string;
  const sku = formData.get('sku') as string;
  const category = formData.get('category') as string;
  const brand = formData.get('brand') as string;
  const weight = parseFloat(formData.get('weight') as string) || null;
  const unit = formData.get('unit') as string;

  if (!name || !sku || !category || !brand) {
    throw new Error('Missing required fields');
  }

  await db.product.create({
    data: {
      name,
      sku,
      category,
      brand,
      weight,
      unit
    }
  });

  redirect('/admin/products');
}
