import { db } from '@/lib/db';
import { Truck, Plus, Phone, Car, CheckCircle, ShieldAlert } from 'lucide-react';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export default async function AdminDriversPage() {
  const drivers = await db.driver.findMany({
    orderBy: { createdAt: 'desc' },
    include: { orders: true }
  });

  async function createDriver(formData: FormData) {
    'use server';
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const vehicleNumber = formData.get('vehicleNumber') as string;

    if (name && phone && vehicleNumber) {
      await db.driver.create({
        data: {
          name,
          phone,
          vehicleNumber,
          status: 'AVAILABLE'
        }
      });
      revalidatePath('/admin/drivers');
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
            DRIVER MANAGEMENT
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '4px' }}>
            Manage delivery staff, vehicle numbers, contact info, and active assignments
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px', alignItems: 'start' }}>
        
        {/* Create Driver Form */}
        <div style={{ background: '#ffffff', borderRadius: '20px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={18} color="#16a34a" /> Add New Delivery Driver
          </h3>

          <form action={createDriver} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#16a34a', display: 'block', marginBottom: '6px' }}>DRIVER FULL NAME</label>
              <input
                type="text"
                name="name"
                placeholder="e.g. Mohammed Tariq"
                required
                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#16a34a', display: 'block', marginBottom: '6px' }}>MOBILE NUMBER</label>
              <input
                type="tel"
                name="phone"
                placeholder="e.g. +966 50 123 4567"
                required
                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#16a34a', display: 'block', marginBottom: '6px' }}>VEHICLE DETAILS / PLATE NUMBER</label>
              <input
                type="text"
                name="vehicleNumber"
                placeholder="e.g. KSA-9941 (Express Van)"
                required
                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
              />
            </div>

            <button
              type="submit"
              style={{
                background: '#16a34a',
                color: '#ffffff',
                border: 'none',
                padding: '14px',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer',
                marginTop: '6px'
              }}
            >
              REGISTER DRIVER
            </button>
          </form>
        </div>

        {/* Drivers List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: '0 0 4px' }}>
            Active Fleet ({drivers.length} Drivers)
          </h3>

          {drivers.length === 0 ? (
            <div style={{ background: '#ffffff', padding: '32px', borderRadius: '20px', textAlign: 'center', color: '#64748b' }}>
              No drivers registered yet. Add your first driver.
            </div>
          ) : (
            drivers.map((driver) => (
              <div
                key={driver.id}
                style={{
                  background: '#ffffff',
                  borderRadius: '20px',
                  padding: '20px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: '#f0fdf4',
                    color: '#16a34a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Truck size={24} />
                  </div>

                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                      {driver.name}
                    </h4>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', gap: '12px', marginTop: '4px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={12} /> {driver.phone}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Car size={12} /> {driver.vehicleNumber}</span>
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    background: driver.status === 'AVAILABLE' ? '#dcfce7' : '#fef3c7',
                    color: driver.status === 'AVAILABLE' ? '#15803d' : '#92400e',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 800
                  }}>
                    {driver.status}
                  </span>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '6px' }}>
                    {driver.orders.length} orders handled
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
