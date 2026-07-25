import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { updateStockQuantity } from './actions';

interface InventoryItem {
  id: string;
  productId: string;
  branchId: string;
  stockQuantity: number;
  product: {
    sku: string;
    name: string;
    category: string;
    unit?: string;
  };
  branch: {
    name: string;
  };
}

export default async function InventoryPage() {
  const session = await getSession();

  if (!session || session.role === 'CUSTOMER') {
    redirect('/login');
  }

  const inventoryList = await db.productBranch.findMany({
    include: {
      product: true,
      branch: true,
    },
    orderBy: {
      product: { name: 'asc' }
    }
  }) as unknown as InventoryItem[];

  return (
    <div>
      <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid var(--border-light)', paddingBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>INVENTORY MANAGEMENT</h1>
          <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '4px' }}>Real-time Stock Levels & Branch Allocation</p>
        </div>
      </header>

      <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '16px 20px', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>SKU</th>
              <th style={{ padding: '16px 20px', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Product Name</th>
              <th style={{ padding: '16px 20px', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Branch</th>
              <th style={{ padding: '16px 20px', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Current Stock</th>
              <th style={{ padding: '16px 20px', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Update Stock</th>
            </tr>
          </thead>
          <tbody>
            {inventoryList.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '16px 20px', fontSize: '0.85rem', color: '#64748b', fontWeight: 700 }}>{item.product.sku}</td>
                <td style={{ padding: '16px 20px', fontWeight: 800, color: '#0F172A', fontSize: '0.9rem' }}>{item.product.name}</td>
                <td style={{ padding: '16px 20px', color: '#64748b', fontSize: '0.85rem' }}>{item.branch.name}</td>
                <td style={{ padding: '16px 20px' }}>
                  <span style={{
                    background: item.stockQuantity > 50 ? '#dcfce7' : item.stockQuantity > 10 ? '#fef3c7' : '#fee2e2',
                    color: item.stockQuantity > 50 ? '#15803d' : item.stockQuantity > 10 ? '#92400e' : '#b91c1c',
                    fontSize: '0.82rem',
                    fontWeight: 900,
                    padding: '6px 12px',
                    borderRadius: '12px'
                  }}>
                    {item.stockQuantity} {item.product.unit || 'UNITS'}
                  </span>
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <form action={async (formData) => {
                    'use server';
                    const qtyStr = formData.get('quantity') as string;
                    const qty = parseInt(qtyStr, 10);
                    if (!isNaN(qty)) {
                      await updateStockQuantity(item.id, qty);
                    }
                  }} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input 
                      type="number" 
                      name="quantity" 
                      defaultValue={item.stockQuantity}
                      style={{ width: '90px', padding: '8px 12px', fontSize: '0.9rem', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '10px', fontWeight: 700 }}
                    />
                    <button type="submit" style={{ background: '#16a34a', color: '#fff', border: 'none', borderRadius: '10px', padding: '8px 14px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}>
                      Update
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
