'use server';

import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function addToCart(productId: string) {
  const session = await getSession();
  if (!session) {
    throw new Error('Must be logged in to add to cart');
  }

  // Find or create cart for user
  let cart = await db.cart.findUnique({
    where: { userId: session.userId }
  });

  if (!cart) {
    cart = await db.cart.create({
      data: { userId: session.userId }
    });
  }

  // Check if item already exists
  const existingItem = await db.cartItem.findFirst({
    where: { cartId: cart.id, productId }
  });

  if (existingItem) {
    await db.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + 1 }
    });
  } else {
    await db.cartItem.create({
      data: { cartId: cart.id, productId, quantity: 1 }
    });
  }

  revalidatePath('/');
  revalidatePath('/cart');
}

export async function updateCartItem(itemId: string, quantity: number) {
  const session = await getSession();
  if (!session) return;

  if (quantity <= 0) {
    await db.cartItem.delete({ where: { id: itemId } });
  } else {
    await db.cartItem.update({
      where: { id: itemId },
      data: { quantity }
    });
  }

  revalidatePath('/cart');
}

export async function removeCartItem(itemId: string) {
  const session = await getSession();
  if (!session) return;

  await db.cartItem.delete({ where: { id: itemId } });
  revalidatePath('/cart');
}
