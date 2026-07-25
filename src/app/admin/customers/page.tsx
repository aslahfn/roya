import { db } from '@/lib/db';
import { Users, Mail, Phone, ShoppingBag } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminCustomersPage() {
  const customers = await db.user.findMany({
    where: { role: 'CUSTOMER' },
    include: { orders: true },
    orderBy: { id: 'desc' }
  });

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
          CUSTOMER DIRECTORY
        </h1>
        <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '4px' }}>
          View registered supermarket customers, contact details, and order history
        </p>
      </div>

      <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '16px 20px', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Customer Name</th>
              <th style={{ padding: '16px 20px', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Email</th>
              <th style={{ padding: '16px 20px', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Mobile</th>
              <th style={{ padding: '16px 20px', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Total Orders</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '16px 20px', fontWeight: 800, color: '#0F172A', fontSize: '0.9rem' }}>{c.name}</td>
                <td style={{ padding: '16px 20px', color: '#64748b', fontSize: '0.85rem' }}>{c.email}</td>
                <td style={{ padding: '16px 20px', color: '#64748b', fontSize: '0.85rem' }}>{c.phone || '+966 50 123 4567'}</td>
                <td style={{ padding: '16px 20px', fontWeight: 800, color: '#16a34a', fontSize: '0.9rem' }}>{c.orders.length} Orders</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
