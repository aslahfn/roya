'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload, X, Check, Image as ImageIcon, Package, Layers } from 'lucide-react';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>(['/logo.jpg']);
  const [dragOver, setDragOver] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [sku, setSku] = useState(`SKU-${Math.floor(1000 + Math.random() * 9000)}`);
  const [category, setCategory] = useState('Produce');
  const [brand, setBrand] = useState('Roya Fresh');
  const [unit, setUnit] = useState('Kg'); // Kg, Gram, Litre, Millilitre, Packet, Piece, Bottle, Box, Dozen, Bundle, Custom
  const [sellingPrice, setSellingPrice] = useState('5.00');
  const [costPrice, setCostPrice] = useState('3.00');
  const [stockQuantity, setStockQuantity] = useState('50');
  const [minStock, setMinStock] = useState('10');
  const [maxStock, setMaxStock] = useState('200');
  const [supplier, setSupplier] = useState('Local Agriculture Co.');
  const [expiryDate, setExpiryDate] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');

  const unitOptions = [
    'Kg',
    'Gram',
    'Litre',
    'Millilitre',
    'Packet',
    'Piece',
    'Bottle',
    'Box',
    'Dozen',
    'Bundle',
    'Custom'
  ];

  const handleImageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages(prev => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setImages(prev => [...prev, event.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          sku,
          category,
          brand,
          unit,
          sellingPrice: parseFloat(sellingPrice),
          costPrice: parseFloat(costPrice),
          stockQuantity: parseInt(stockQuantity),
          minStock: parseInt(minStock),
          maxStock: parseInt(maxStock),
          supplier,
          expiryDate: expiryDate || null,
          purchaseDate: purchaseDate || null,
          images: images[0] || '/logo.jpg',
        }),
      });

      if (res.ok) {
        window.location.href = '/admin/products';
      } else {
        alert('Failed to create product.');
      }
    } catch (err) {
      alert('Error creating product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link href="/admin/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#16a34a', fontWeight: 800, textDecoration: 'none', fontSize: '0.88rem' }}>
          <ArrowLeft size={16} /> Back to Product Catalog
        </Link>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0F172A', marginTop: '8px' }}>
          ADD NEW GROCERY PRODUCT
        </h1>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '24px' }}>
        {/* Requirement 10: Product Images Drag & Drop Component */}
        <div style={{ background: '#ffffff', borderRadius: '20px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ImageIcon size={18} color="#16a34a" /> Product Image Upload (Multiple Support)
          </h3>

          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleImageDrop}
            style={{
              border: dragOver ? '2px dashed #16a34a' : '2px dashed #cbd5e1',
              background: dragOver ? '#f0fdf4' : '#fafafa',
              borderRadius: '16px',
              padding: '32px 20px',
              textAlign: 'center',
              cursor: 'pointer',
              marginBottom: '16px'
            }}
          >
            <Upload size={32} color="#16a34a" style={{ marginBottom: '8px' }} />
            <p style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0F172A', margin: '0 0 4px' }}>
              Drag & Drop product images here
            </p>
            <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>
              or click to browse files (JPEG, PNG, WebP)
            </p>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              style={{ display: 'none' }}
              id="product-img-input"
            />
            <label htmlFor="product-img-input" style={{ display: 'inline-block', marginTop: '12px', background: '#16a34a', color: '#fff', padding: '8px 16px', borderRadius: '12px', fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer' }}>
              Browse Image Files
            </label>
          </div>

          {/* Image Previews */}
          {images.length > 0 && (
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {images.map((img, idx) => (
                <div key={idx} style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                  <img src={img} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(239, 68, 68, 0.9)', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Basic Details & Requirement 11 Measurement Unit */}
        <div style={{ background: '#ffffff', borderRadius: '20px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.03)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#16a34a', display: 'block', marginBottom: '6px' }}>PRODUCT NAME</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Organic Basmati Rice"
              required
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #cbd5e1' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#16a34a', display: 'block', marginBottom: '6px' }}>CATEGORY</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #cbd5e1', fontWeight: 700 }}
            >
              <option value="Produce">Produce (Fruits & Veggies)</option>
              <option value="Dairy">Dairy & Milk</option>
              <option value="Bakery">Bakery & Bread</option>
              <option value="Grains & Rice">Grains & Rice</option>
              <option value="Beverages">Beverages & Juices</option>
              <option value="Meat & Poultry">Meat & Poultry</option>
            </select>
          </div>

          {/* Requirement 11: Measurement Unit Dropdown */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#16a34a', display: 'block', marginBottom: '6px' }}>MEASUREMENT UNIT (REQUIRED)</label>
            <select
              value={unit}
              onChange={e => setUnit(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #cbd5e1', fontWeight: 800, color: '#16a34a', background: '#f0fdf4' }}
            >
              {unitOptions.map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#16a34a', display: 'block', marginBottom: '6px' }}>SELLING PRICE (AED)</label>
            <input
              type="number"
              step="0.01"
              value={sellingPrice}
              onChange={e => setSellingPrice(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #cbd5e1' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#16a34a', display: 'block', marginBottom: '6px' }}>COST PRICE (AED)</label>
            <input
              type="number"
              step="0.01"
              value={costPrice}
              onChange={e => setCostPrice(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #cbd5e1' }}
            />
          </div>
        </div>

        {/* Requirement 12: Inventory Management Fields */}
        <div style={{ background: '#ffffff', borderRadius: '20px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.03)', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <div style={{ gridColumn: 'span 3' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Package size={18} color="#16a34a" /> Inventory Parameters & Thresholds
            </h3>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#16a34a', display: 'block', marginBottom: '6px' }}>INITIAL STOCK QTY</label>
            <input
              type="number"
              value={stockQuantity}
              onChange={e => setStockQuantity(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #cbd5e1' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#16a34a', display: 'block', marginBottom: '6px' }}>MINIMUM STOCK THRESHOLD</label>
            <input
              type="number"
              value={minStock}
              onChange={e => setMinStock(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #cbd5e1' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#16a34a', display: 'block', marginBottom: '6px' }}>MAXIMUM STOCK CAPACITY</label>
            <input
              type="number"
              value={maxStock}
              onChange={e => setMaxStock(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #cbd5e1' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#16a34a', display: 'block', marginBottom: '6px' }}>SUPPLIER NAME</label>
            <input
              type="text"
              value={supplier}
              onChange={e => setSupplier(e.target.value)}
              placeholder="e.g. Almarai Dairy"
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #cbd5e1' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#16a34a', display: 'block', marginBottom: '6px' }}>EXPIRY DATE</label>
            <input
              type="date"
              value={expiryDate}
              onChange={e => setExpiryDate(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #cbd5e1' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#16a34a', display: 'block', marginBottom: '6px' }}>PURCHASE DATE</label>
            <input
              type="date"
              value={purchaseDate}
              onChange={e => setPurchaseDate(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #cbd5e1' }}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            background: '#16a34a',
            color: '#ffffff',
            padding: '16px',
            borderRadius: '16px',
            fontWeight: 900,
            fontSize: '1rem',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(22, 163, 74, 0.35)'
          }}
        >
          {loading ? 'SAVING PRODUCT...' : 'SAVE & PUBLISH PRODUCT'}
        </button>
      </form>
    </div>
  );
}
