'use server';

import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function claimOrder(orderId: string) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  await db.order.update({
    where: { id: orderId },
    data: { 
      driverId: session.userId,
      status: 'OUT_FOR_DELIVERY'
    }
  });

  revalidatePath('/admin/delivery');
}

export async function markDelivered(orderId: string) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  await db.order.update({
    where: { id: orderId },
    data: { 
      status: 'DELIVERED',
      paymentStatus: 'PAID'
    }
  });

  revalidatePath('/admin/delivery');
}

export async function assignDriverAction(orderId: string, driverId?: string, estimatedTime?: string) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  const targetDriverId = driverId || session.userId;
  let etaDate = estimatedTime ? new Date(estimatedTime) : new Date(Date.now() + 30 * 60 * 1000);

  await db.order.update({
    where: { id: orderId },
    data: {
      driverId: targetDriverId,
      status: 'OUT_FOR_DELIVERY',
      estimatedDeliveryTime: etaDate
    }
  });

  revalidatePath('/admin/delivery');
  revalidatePath(`/orders/${orderId}`);
}

export async function verifyDeliveryOtpAction(orderId: string, inputOtp: string) {
  const session = await getSession();
  if (!session) return { success: false, error: 'Unauthorized' };

  const order = await db.order.findUnique({ where: { id: orderId } });
  if (!order) return { success: false, error: 'Order not found' };

  if (order.otp && order.otp.trim() !== inputOtp.trim()) {
    return { success: false, error: 'Incorrect OTP code. Please ask customer for valid 4-digit code.' };
  }

  await db.order.update({
    where: { id: orderId },
    data: { 
      status: 'DELIVERED',
      paymentStatus: 'PAID'
    }
  });

  revalidatePath('/admin/delivery');
  revalidatePath(`/orders/${orderId}`);
  return { success: true };
}

export async function updateOrderStatusAction(orderId: string, newStatus: string) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  await db.order.update({
    where: { id: orderId },
    data: { status: newStatus }
  });

  revalidatePath('/admin/delivery');
  revalidatePath(`/orders/${orderId}`);
}

export async function markDeliveredAction(orderId: string) {
  return markDelivered(orderId);
}

export async function updateOrderItemQuantityAction(orderId: string, orderItemId: string, quantity: number) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  if (quantity <= 0) {
    await db.orderItem.delete({ where: { id: orderItemId } });
  } else {
    await db.orderItem.update({
      where: { id: orderItemId },
      data: { quantity }
    });
  }

  // Recalculate order total
  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { items: true }
  });

  if (order) {
    const totalAmount = order.items.reduce((sum, item) => sum + item.price * item.quantity, 5.00);
    await db.order.update({
      where: { id: orderId },
      data: { totalAmount }
    });
  }

  revalidatePath('/admin/delivery');
  revalidatePath(`/orders/${orderId}`);
}

export async function confirmOrderAction(orderId: string) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  await db.order.update({
    where: { id: orderId },
    data: { status: 'CONFIRMED' }
  });

  revalidatePath('/admin/delivery');
  revalidatePath(`/orders/${orderId}`);
}
