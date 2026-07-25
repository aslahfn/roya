import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { DeliveryDispatchBoard } from './components/DeliveryDispatchBoard';

export default async function DeliveryDispatchPage() {
  const session = await getSession();
  
  const allOrders = await db.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: true,
      driver: true,
      items: { include: { product: true } }
    }
  });

  const availableDrivers = await db.user.findMany({
    where: {
      role: { in: ['SUPER_ADMIN', 'DELIVERY_MANAGER', 'STORE_MANAGER', 'CUSTOMER_SUPPORT'] }
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true
    }
  });

  return (
    <div>
      <header style={{ marginBottom: '32px', borderBottom: '1px solid var(--border-light)', paddingBottom: '20px' }}>
        <h1 className="title" style={{ fontSize: '3rem', margin: 0, lineHeight: 1 }}>DISPATCH BOARD</h1>
        <p className="subtitle" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '12px' }}>
          DELIVERY DISPATCH, DRIVER ASSIGNMENT & OTP VERIFICATION
        </p>
      </header>

      <DeliveryDispatchBoard
        initialOrders={allOrders}
        availableDrivers={availableDrivers}
        currentUserId={session?.userId || ''}
      />
    </div>
  );
}
