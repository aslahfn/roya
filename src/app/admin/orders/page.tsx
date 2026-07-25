import { db } from '@/lib/db';
import { ShoppingBag, Truck, CheckCircle, AlertTriangle, Edit3, UserCheck, FileText } from 'lucide-react';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  const orders = await db.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: true,
      assignedDriver: true,
      items: {
        include: {
          product: {
            include: { inventory: true }
          }
        }
      }
    }
  });

  const drivers = await db.driver.findMany({
    where: { status: 'AVAILABLE' }
  });

  async function updateOrderStatus(formData: FormData) {
    'use server';
    const orderId = formData.get('orderId') as string;
    const status = formData.get('status') as string;
    const driverId = formData.get('driverId') as string;

    if (orderId && status) {
      await db.order.update({
        where: { id: orderId },
        data: {
          status,
          ...(driverId ? { assignedDriverId: driverId } : {})
        }
      });

      // Create status notification
      await db.notification.create({
        data: {
          roleTarget: 'CUSTOMER',
          title: `📦 Order #${orderId.slice(-6).toUpperCase()} Status Updated`,
          message: `Your supermarket order is now: ${status.replace(/_/g, ' ')}`,
          type: `ORDER_${status}`,
        }
      });

      revalidatePath('/admin/orders');
    }
  }

  async function modifyItemQuantity(formData: FormData) {
    'use server';
    const orderId = formData.get('orderId') as string;
    const itemId = formData.get('itemId') as string;
    const newQty = parseInt(formData.get('quantity') as string);
    const replacementNote = formData.get('replacementNote') as string;

    if (orderId && itemId && !isNaN(newQty)) {
      const orderItem = await db.orderItem.findUnique({ where: { id: itemId } });
      if (orderItem) {
        await db.orderItem.update({
          where: { id: itemId },
          data: {
            originalQty: orderItem.originalQty || orderItem.quantity,
            quantity: newQty,
            replacementNote: replacementNote || null
          }
        });

        await db.order.update({
          where: { id: orderId },
          data: { inventoryAdjusted: true }
        });

        // Notify customer
        await db.notification.create({
          data: {
            roleTarget: 'CUSTOMER',
            title: `⚠️ Order #${orderId.slice(-6).toUpperCase()} Inventory Adjustment`,
            message: `Admin modified item quantity due to stock availability. Note: ${replacementNote || 'Quantity adjusted'}`,
            type: 'ORDER_UPDATED',
          }
        });

        revalidatePath('/admin/orders');
      }
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
            ORDERS & FULFILLMENT
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '4px' }}>
            Inventory validation, partial order approval, driver assignment, and status updates
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {orders.length === 0 ? (
          <div style={{ background: '#ffffff', padding: '40px', borderRadius: '20px', textAlign: 'center', color: '#64748b' }}>
            No customer orders placed yet.
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              style={{
                background: '#ffffff',
                borderRadius: '20px',
                padding: '24px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 14px rgba(0,0,0,0.03)'
              }}
            >
              {/* Top Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0A4D2E', margin: 0 }}>
                      Order #{order.id.slice(-6).toUpperCase()}
                    </h3>
                    <span style={{
                      background: order.status === 'DELIVERED' ? '#dcfce7' : order.status === 'CANCELLED' ? '#fee2e2' : '#fef3c7',
                      color: order.status === 'DELIVERED' ? '#15803d' : order.status === 'CANCELLED' ? '#b91c1c' : '#92400e',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: 800
                    }}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '4px' }}>
                    Customer: <strong>{order.user?.name || 'Dave Customer'}</strong> • {order.createdAt.toLocaleString()}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Link
                    href={`/api/invoice/${order.id}`}
                    target="_blank"
                    style={{
                      background: '#f0fdf4',
                      color: '#16a34a',
                      border: '1px solid #bbf7d0',
                      padding: '8px 14px',
                      borderRadius: '12px',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <FileText size={16} /> View Invoice & PDF
                  </Link>
                </div>
              </div>

              {/* Requirement 6: Inventory Validation Table (Ordered vs Available) */}
              <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '16px', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertTriangle size={16} color="#eab308" /> Inventory Check (Ordered vs Available Stock)
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {order.items.map((item) => {
                    const availableStock = item.product.inventory[0]?.stockQuantity || 0;
                    const isStockSufficient = availableStock >= item.quantity;

                    return (
                      <div
                        key={item.id}
                        style={{
                          background: '#ffffff',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          border: isStockSufficient ? '1px solid #e2e8f0' : '1px solid #fca5a5',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px',
                          flexWrap: 'wrap'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0F172A' }}>
                            {item.product.name} ({item.unit || item.product.unit || 'Piece'})
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                            AED {item.price.toFixed(2)} per {item.unit || item.product.unit || 'unit'}
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div style={{ fontSize: '0.82rem', textAlign: 'center' }}>
                            <div style={{ color: '#64748b', fontWeight: 700, fontSize: '0.7rem' }}>ORDERED</div>
                            <div style={{ fontWeight: 900, color: '#0F172A', fontSize: '0.95rem' }}>{item.quantity}</div>
                          </div>

                          <div style={{ fontSize: '0.82rem', textAlign: 'center' }}>
                            <div style={{ color: '#64748b', fontWeight: 700, fontSize: '0.7rem' }}>AVAILABLE</div>
                            <div style={{ fontWeight: 900, color: isStockSufficient ? '#16a34a' : '#dc2626', fontSize: '0.95rem' }}>
                              {availableStock}
                            </div>
                          </div>

                          {/* Partial Order Quantity Edit Form */}
                          <form action={modifyItemQuantity} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                            <input type="hidden" name="orderId" value={order.id} />
                            <input type="hidden" name="itemId" value={item.id} />
                            <input
                              type="number"
                              name="quantity"
                              defaultValue={item.quantity}
                              min="0"
                              style={{ width: '60px', padding: '6px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 800, textAlign: 'center' }}
                            />
                            <input
                              type="text"
                              name="replacementNote"
                              placeholder="Reason / Replacement"
                              defaultValue={item.replacementNote || ''}
                              style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.78rem' }}
                            />
                            <button
                              type="submit"
                              style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '8px', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer' }}
                            >
                              Adjust
                            </button>
                          </form>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Requirement 8 & 13: Order Status & Driver Assignment */}
              <form action={updateOrderStatus} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', alignItems: 'end', background: '#f0fdf4', padding: '16px', borderRadius: '16px', border: '1px solid #bbf7d0' }}>
                <input type="hidden" name="orderId" value={order.id} />

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#166534', display: 'block', marginBottom: '6px' }}>UPDATE ORDER STAGE</label>
                  <select
                    name="status"
                    defaultValue={order.status}
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #bbf7d0', fontWeight: 800, color: '#0A4D2E' }}
                  >
                    <option value="RECEIVED">Pending (Received)</option>
                    <option value="ACCEPTED">Accepted</option>
                    <option value="PREPARING">Preparing</option>
                    <option value="PACKED">Packed</option>
                    <option value="ASSIGNED_DRIVER">Assigned Driver</option>
                    <option value="OUT_FOR_DELIVERY">Out For Delivery</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#166534', display: 'block', marginBottom: '6px' }}>ASSIGN DELIVERY DRIVER</label>
                  <select
                    name="driverId"
                    defaultValue={order.assignedDriverId || ''}
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #bbf7d0', fontWeight: 800, color: '#0A4D2E' }}
                  >
                    <option value="">-- Select Driver --</option>
                    {drivers.map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.vehicleNumber})</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  style={{
                    background: '#16a34a',
                    color: '#ffffff',
                    padding: '12px',
                    borderRadius: '10px',
                    fontWeight: 900,
                    fontSize: '0.85rem',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  SAVE & NOTIFY CUSTOMER
                </button>
              </form>

              {order.assignedDriver && (
                <div style={{ marginTop: '12px', fontSize: '0.82rem', color: '#15803d', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <UserCheck size={16} /> Driver Assigned: {order.assignedDriver.name} ({order.assignedDriver.phone}) • Vehicle: {order.assignedDriver.vehicleNumber}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
