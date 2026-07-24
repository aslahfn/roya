import { createProduct } from '../actions';
import Link from 'next/link';

export default function NewProductPage() {
  return (
    <div>
      <header style={{ marginBottom: '48px', borderBottom: '1px solid var(--border-light)', paddingBottom: '24px' }}>
        <Link href="/admin/products" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px', display: 'inline-block' }}>← BACK TO CATALOG</Link>
        <h1 className="title" style={{ fontSize: '3.5rem', margin: 0, lineHeight: 1 }}>NEW_ITEM</h1>
        <p className="subtitle" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '16px' }}>ADD TO INVENTORY</p>
      </header>

      <div className="glass-panel" style={{ maxWidth: '800px', padding: '40px' }}>
        <form action={createProduct}>
          <div className="input-group">
            <label className="input-label">Product Name</label>
            <input type="text" name="name" className="input-field" required placeholder="e.g. Organic Bananas" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="input-group">
              <label className="input-label">SKU</label>
              <input type="text" name="sku" className="input-field" required placeholder="BNN-ORG-001" />
            </div>
            <div className="input-group">
              <label className="input-label">Brand</label>
              <input type="text" name="brand" className="input-field" required placeholder="Farm Fresh" />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Category</label>
            <input type="text" name="category" className="input-field" required placeholder="Produce" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="input-group">
              <label className="input-label">Weight</label>
              <input type="number" step="0.01" name="weight" className="input-field" placeholder="1.5" />
            </div>
            <div className="input-group">
              <label className="input-label">Unit</label>
              <input type="text" name="unit" className="input-field" placeholder="kg" />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '24px', width: '100%' }}>
            SAVE NEW PRODUCT
          </button>
        </form>
      </div>
    </div>
  );
}
