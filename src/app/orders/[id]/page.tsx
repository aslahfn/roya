import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { RoyalHeader } from '@/components/layout/RoyalHeader';
import { ArrowLeft, Package, Truck, Phone, CheckCircle, FileText, AlertTriangle } from 'lucide-react';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export default async function OrderDetailsPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const order = await db.order.findUnique({
    where: { id },
    include: {
      user: true,
      assignedDriver: true,
      items: {
        include: { product: true }
      }
    }
  });

  if (!order) {
    redirect('/orders');
  }

  async function respondToAdjustment(formData: FormData) {
    'use server';
    const responseType = formData.get('responseType') as string;

    if (responseType === 'ACCEPT') {
      await db.order.update({
        where: { id },
        data: { customerAccepted: true }
      });
    } else if (responseType === 'CANCEL') {
      await db.order.update({
        where: { id },
        data: { status: 'CANCELLED' }
      });
    }

    revalidatePath(`/orders/${id}`);
  }

  const stages = [
    'RECEIVED',
    'ACCEPTED',
    'PREPARING',
    'PACKED',
    'ASSIGNED_DRIVER',
    'OUT_FOR_DELIVERY',
    'DELIVERED'
  ];

  const currentStageIndex = stages.indexOf(order.status);

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '100px' }}>
      <RoyalHeader session={session} />

      <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ marginBottom: '16px' }}>
          <Link href="/orders" style={{ color: '#16a34a', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 700 }}>
            <ArrowLeft size={16} /> Back to My Orders
          </Link>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '24px', padding: '28px', border: '1px solid #e2e8f0', boxShadow: '0 6px 20px rgba(0,0,0,0.04)' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0A4D2E', margin: 0 }}>
                Order #{order.id.slice(-6).toUpperCase()}
              </h1>
              <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '4px' }}>
                Placed on {new Date(order.createdAt).toLocaleString()}
              </div>
            </div>

            <Link
              href={`/api/invoice/${order.id}`}
              target="_blank"
              style={{
                background: '#16a34a',
                color: '#ffffff',
                padding: '10px 18px',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '0.85rem',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <FileText size={16} /> View & Download Invoice PDF
            </Link>
          </div>

          {/* Requirement 13: Order Status Workflow Live Progress Bar */}
          <div style={{ background: '#f0fdf4', borderRadius: '18px', padding: '20px', marginBottom: '28px', border: '1px solid #bbf7d0' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0A4D2E', marginBottom: '16px' }}>
              LIVE DELIVERY STATUS WORKFLOW
            </h3>

            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
              {stages.map((stage, idx) => {
                const isPassed = idx <= currentStageIndex;
                const isCurrent = idx === currentStageIndex;

                return (
                  <div key={stage} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, textAlign: 'center', position: 'relative', zIndex: 1 }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: isPassed ? '#16a34a' : '#e2e8f0',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 900,
                      fontSize: '0.75rem',
                      boxShadow: isCurrent ? '0 0 0 4px #bbf7d0' : 'none'
                    }}>
                      {idx + 1}
                    </div>
                    <span style={{ fontSize: '0.65rem', fontWeight: isCurrent ? 900 : 700, color: isPassed ? '#15803d' : '#94a3b8', marginTop: '6px' }}>
                      {stage.replace(/_/g, ' ')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Requirement 7: Customer Notification After Admin Changes Panel */}
          {order.inventoryAdjusted && (
            <div style={{ background: '#fff7ed', border: '1.5px solid #fed7aa', borderRadius: '18px', padding: '20px', marginBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <AlertTriangle size={20} color="#c2410c" />
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#9a3412', margin: 0 }}>
                  Order Revised by Supermarket Admin
                </h4>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#c2410c', margin: '0 0 16px', lineHeight: 1.4 }}>
                Some items were adjusted due to fresh stock availability. Please review the updated quantities below.
              </p>

              <form action={respondToAdjustment} style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="submit"
                  name="responseType"
                  value="ACCEPT"
                  style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', fontSize: '0.85rem' }}
                >
                  Accept Changes & Continue
                </button>
                <button
                  type="submit"
                  name="responseType"
                  value="CANCEL"
                  style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', fontSize: '0.85rem' }}
                >
                  Cancel Order
                </button>
              </form>
            </div>
          )}

          {/* Requirement 8: Driver Assignment Display */}
          {order.assignedDriver && (
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '18px', padding: '20px', marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Truck size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1d4ed8' }}>ASSIGNED DELIVERY DRIVER</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#1e3a8a', marginTop: '2px' }}>
                  {order.assignedDriver.name} ({order.assignedDriver.vehicleNumber})
                </div>
                <div style={{ fontSize: '0.85rem', color: '#2563eb', fontWeight: 700, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Phone size={14} /> Call Driver: {order.assignedDriver.phone}
                </div>
              </div>
            </div>
          )}

          {/* Items Summary Table */}
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginBottom: '14px' }}>Ordered Items</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {order.items.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0F172A' }}>{item.product.name}</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    Qty: {item.quantity} {item.unit || item.product.unit || 'Piece'}
                    {item.originalQty && item.originalQty !== item.quantity && (
                      <span style={{ color: '#c2410c', fontWeight: 700, marginLeft: '6px' }}>(Original: {item.originalQty})</span>
                    )}
                  </div>
                </div>
                <div style={{ fontWeight: 900, color: '#0A4D2E', fontSize: '0.95rem' }}>
                  AED {(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', paddingTop: '16px', borderTop: '2px solid #f1f5f9', fontWeight: 900, fontSize: '1.2rem', color: '#0A4D2E' }}>
            <span>Total Amount:</span>
            <span>AED {order.totalAmount.toFixed(2)}</span>
          </div>

        </div>
      </div>
    </div>
  );
}
