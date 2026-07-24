'use server';

import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function updateStockQuantity(inventoryId: string, newQuantity: number) {
  const session = await getSession();

  if (!session || (session.role === 'CUSTOMER')) {
    throw new Error('Unauthorized');
  }

  await db.productBranch.update({
    where: { id: inventoryId },
    data: { stockQuantity: newQuantity },
  });

  revalidatePath('/admin/inventory');
}
