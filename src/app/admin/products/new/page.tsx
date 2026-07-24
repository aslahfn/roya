import { createProduct } from '../actions';
import Link from 'next/link';

export const categoriesList = [
  'STATIONARY',
  'RICE',
  'COOL DRINKS',
  'PLASTIC ITEMS',
  'TOYS',
  'CROCKERY ITEMS',
  'HOME APPLIANCE',
  'FOOD ITEMS',
  'FOOT WEAR',
  'ACCESSORIES',
  'CHICKEN',
  'WATER',
  'OIL',
  'ASAL',
  'MILK',
  'JUBIN',
  'TAMAR',
  'SABOON (SOAP POWDER)',
  'HALAVIYATH&BISCUITS',
  'FINE & PAMPERS',
  'ICE CREAM & FROZEN ITEMS',
  'CLEANING ITEMS'
];

export default function NewProductPage() {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <header style={{ marginBottom: '32px', borderBottom: '1px solid var(--border-light)', paddingBottom: '20px' }}>
        <Link href="/admin/products" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', display: 'inline-block' }}>
          ← BACK TO INVENTORY CATALOG
        </Link>
        <h1 className="title" style={{ fontSize: '2.5rem', margin: 0, lineHeight: 1 }}>ADD NEW PRODUCT</h1>
        <p className="subtitle" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '8px', fontSize: '0.85rem' }}>
          SELECT CATEGORY AND ENTER PRODUCT DETAILS
        </p>
      </header>

      <div className="royal-card" style={{ padding: '36px', background: '#ffffff' }}>
        <form action={createProduct}>
          
          {/* Category Dropdown matching client ERP screenshot */}
          <div className="input-group">
            <label className="input-label" style={{ color: '#16A34A', fontWeight: 800 }}>
              CATEGORY SELECT (DEPARTMENT) *
            </label>
            <select
              name="category"
              className="input-field"
              required
              style={{
                background: '#F0FDF4',
                borderColor: '#16A34A',
                fontWeight: 700,
                fontSize: '1rem',
                color: '#052E16',
                cursor: 'pointer',
                padding: '14px'
              }}
            >
              <option value="">-- Choose Category --</option>
              {categoriesList.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group" style={{ marginTop: '16px' }}>
            <label className="input-label">Product Name *</label>
            <input type="text" name="name" className="input-field" required placeholder="e.g. Almarai Fresh Milk 2L" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="input-group">
              <label className="input-label">SKU / BARCODE *</label>
              <input type="text" name="sku" className="input-field" required placeholder="SKU-98471" />
            </div>
            <div className="input-group">
              <label className="input-label">Brand Name *</label>
              <input type="text" name="brand" className="input-field" required placeholder="e.g. Sadia / Almarai" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="input-group">
              <label className="input-label">Package Weight</label>
              <input type="number" step="0.01" name="weight" className="input-field" placeholder="1.0" />
            </div>
            <div className="input-group">
              <label className="input-label">Unit of Measure</label>
              <input type="text" name="unit" className="input-field" placeholder="kg / L / Piece" />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '24px', width: '100%', padding: '16px', fontSize: '1rem', fontWeight: 800 }}>
            💾 SAVE PRODUCT TO INVENTORY
          </button>
        </form>
      </div>
    </div>
  );
}
