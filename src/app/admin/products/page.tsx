import { db } from '@/lib/db';
import Link from 'next/link';

export default async function AdminProductsPage() {
  const products = await db.product.findMany({
    include: {
      inventory: {
        include: { branch: true }
      }
    }
  });

  return (
    <div>
      <header style={{ marginBottom: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid var(--border-light)', paddingBottom: '24px' }}>
        <div>
          <h1 className="title" style={{ fontSize: '3.5rem', margin: 0, lineHeight: 1 }}>CATALOG</h1>
          <p className="subtitle" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '16px' }}>INVENTORY MANAGEMENT</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <Link href="/admin/products/new" className="btn btn-primary">ADD ITEM</Link>
        </div>
      </header>

      <div className="table-container brutalist-panel">
        <table className="table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name & SKU</th>
              <th>Category</th>
              <th>Brand</th>
              <th>Features</th>
              <th>Stock Qty</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const totalStock = p.inventory.reduce((acc, inv) => acc + inv.stockQuantity, 0);
              const status = !p.isActive ? 'Inactive' : p.availabilityStatus === 'OUT_OF_STOCK' ? 'Out of Stock' : totalStock > 10 ? 'In Stock' : totalStock > 0 ? 'Low Stock' : 'Out of Stock';
              
              return (
                <tr key={p.id}>
                  <td>
                    <div style={{ width: '40px', height: '40px', background: 'var(--bg-tertiary)', borderRadius: '8px', backgroundImage: p.images ? `url(${p.images})` : 'none', backgroundSize: 'cover' }}></div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{p.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>SKU: {p.sku} {p.barcode ? `| BC: ${p.barcode}` : ''}</div>
                  </td>
                  <td>
                    <div>{p.category}</div>
                    {p.subcategory && <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{p.subcategory}</div>}
                  </td>
                  <td>{p.brand}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {p.isFeatured && <span className="badge badge-accent" style={{ fontSize: '0.65rem' }}>★ FEATURED</span>}
                      {p.isBestSeller && <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>🔥 BEST SELLER</span>}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600 }}>{totalStock} {p.unit}</span>
                  </td>
                  <td>
                    <span className={`badge ${status === 'In Stock' ? 'badge-success' : status === 'Low Stock' ? 'badge-warning' : 'badge-error'}`}>
                      {status}
                    </span>
                  </td>
                  <td>
                    <Link href={`/admin/products/${p.id}`} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>EDIT</Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div style={{ marginTop: '16px', fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
        Note: Pricing information is strictly redacted from this view for unauthorized personnel.
      </div>
    </div>
  );
}
