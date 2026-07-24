import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';

export default async function PricingModulePage() {
  const session = await getSession();

  // Double check RBAC at the page level for safety
  if (session?.role !== 'SUPER_ADMIN' && session?.role !== 'PRICING_MANAGER') {
    redirect('/admin');
  }

  const pricingList = await db.pricing.findMany({
    include: {
      product: true,
      branch: true,
    },
    orderBy: {
      product: { name: 'asc' }
    }
  });

  return (
    <div>
      <header style={{ marginBottom: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid var(--border-light)', paddingBottom: '24px' }}>
        <div>
          <h1 className="title text-accent" style={{ fontSize: '3.5rem', margin: 0, lineHeight: 1 }}>PRICING</h1>
          <p className="subtitle" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '16px' }}>CONFIDENTIAL CONTROL PANEL</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button className="btn btn-secondary">EXPORT</button>
          <button className="btn btn-primary">BULK UPDATE</button>
        </div>
      </header>

      <div className="table-container brutalist-panel" style={{ borderColor: 'var(--accent-primary)' }}>
        <table className="table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Product</th>
              <th>Branch</th>
              <th>Cost Price</th>
              <th>Selling Price</th>
              <th>Discount Price</th>
              <th>Margin</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pricingList.map((p) => {
              const margin = p.sellingPrice - p.costPrice;
              const marginPercent = ((margin / p.costPrice) * 100).toFixed(1);

              return (
                <tr key={p.id}>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>{p.product.sku}</td>
                  <td style={{ fontWeight: 600 }}>{p.product.name}</td>
                  <td>{p.branch.name}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>${p.costPrice.toFixed(2)}</td>
                  <td style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>${p.sellingPrice.toFixed(2)}</td>
                  <td>{p.discountPrice ? `$${p.discountPrice.toFixed(2)}` : '-'}</td>
                  <td>
                    <span className={`badge ${margin > 0 ? 'badge-success' : 'badge-error'}`}>
                      {marginPercent}%
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Edit</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
