'use server';

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
  };
  branch: {
    name: string;
  };
}

export default async function InventoryPage() {
  const session = await getSession();

  if (!session || (session.role === 'CUSTOMER')) {
    redirect('/admin');
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
      <header style={{ marginBottom: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid var(--border-light)', paddingBottom: '24px' }}>
        <div>
          <h1 className="title" style={{ fontSize: '3.5rem', margin: 0, lineHeight: 1 }}>INVENTORY</h1>
          <p className="subtitle" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '16px' }}>STOCK MANAGEMENT PANEL</p>
        </div>
      </header>

      <div className="table-container brutalist-panel">
        <table className="table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Product</th>
              <th>Branch</th>
              <th>Current Stock</th>
              <th>Update Stock</th>
            </tr>
          </thead>
          <tbody>
            {inventoryList.map((item) => (
              <tr key={item.id}>
                <td style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>{item.product.sku}</td>
                <td style={{ fontWeight: 600 }}>{item.product.name}</td>
                <td>{item.branch.name}</td>
                <td>
                  <span className={`badge ${item.stockQuantity > 50 ? 'badge-success' : item.stockQuantity > 10 ? 'badge-warning' : 'badge-error'}`} style={{ fontSize: '1rem', padding: '8px 16px' }}>
                    {item.stockQuantity} UNITS
                  </span>
                </td>
                <td>
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
                      className="input-field" 
                      style={{ width: '100px', padding: '6px 12px', fontSize: '0.9rem', background: '#fff', border: '1px solid #cbd5e1' }}
                    />
                    <button type="submit" className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
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
