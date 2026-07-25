import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Trash2, Package } from 'lucide-react';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const session = await getSession();

  if (!session || session.role === 'CUSTOMER') {
    redirect('/login');
  }

  const product = await db.product.findUnique({
    where: { id },
    include: {
      inventory: true,
      pricing: true,
    }
  });

  if (!product) {
    redirect('/admin/products');
  }

  async function updateProduct(formData: FormData) {
    'use server';

    const name = formData.get('name') as string;
    const category = formData.get('category') as string;
    const brand = formData.get('brand') as string;
    const unit = formData.get('unit') as string;
    const price = parseFloat(formData.get('price') as string || '0');
    const stock = parseInt(formData.get('stock') as string || '0', 10);
    const minStock = parseInt(formData.get('minStock') as string || '5', 10);
    const supplier = formData.get('supplier') as string;

    await db.product.update({
      where: { id },
      data: {
        name,
        category,
        brand,
        unit,
        minStock,
        supplier,
      }
    });

    const targetProduct = await db.product.findUnique({
      where: { id },
      include: { pricing: true, inventory: true }
    });

    if (targetProduct) {
      if (targetProduct.pricing.length > 0) {
        await db.pricing.update({
          where: { id: targetProduct.pricing[0].id },
          data: { sellingPrice: price }
        });
      }

      if (targetProduct.inventory.length > 0) {
        await db.productBranch.update({
          where: { id: targetProduct.inventory[0].id },
          data: { stockQuantity: stock }
        });
      }
    }

    revalidatePath('/admin/products');
    revalidatePath('/admin/inventory');
    revalidatePath('/');
    redirect('/admin/products');
  }

  async function deleteProduct() {
    'use server';

    await db.pricing.deleteMany({ where: { productId: id } });
    await db.productBranch.deleteMany({ where: { productId: id } });
    await db.cartItem.deleteMany({ where: { productId: id } });
    await db.orderItem.deleteMany({ where: { productId: id } });
    await db.product.delete({ where: { id } });

    revalidatePath('/admin/products');
    revalidatePath('/');
    redirect('/admin/products');
  }

  const currentPrice = product.pricing[0]?.sellingPrice || 0;
  const currentStock = product.inventory[0]?.stockQuantity || 0;

  return (
    <div style={{ padding: '24px', maxWidth: '800px' }}>
      <div style={{ marginBottom: '20px' }}>
        <Link href="/admin/products" style={{ color: '#16a34a', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontWeight: 800, fontSize: '0.85rem' }}>
          <ArrowLeft size={16} /> Back to Products Catalog
        </Link>
      </div>

      <div style={{ background: '#ffffff', borderRadius: '24px', padding: '32px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Package color="#16a34a" size={28} /> Edit Product #{product.sku}
          </h1>

          <form action={deleteProduct}>
            <button
              type="submit"
              style={{ background: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5', padding: '8px 16px', borderRadius: '12px', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Trash2 size={16} /> Delete Product
            </button>
          </form>
        </div>

        <form action={updateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: '6px' }}>PRODUCT NAME</label>
            <input
              type="text"
              name="name"
              defaultValue={product.name}
              required
              style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.95rem', fontWeight: 700 }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: '6px' }}>CATEGORY</label>
              <input
                type="text"
                name="category"
                defaultValue={product.category}
                required
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: '6px' }}>BRAND</label>
              <input
                type="text"
                name="brand"
                defaultValue={product.brand}
                required
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: '6px' }}>UNIT OF MEASURE</label>
              <select
                name="unit"
                defaultValue={product.unit || 'Piece'}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.9rem', background: '#fff', fontWeight: 700 }}
              >
                <option value="Kg">Kg</option>
                <option value="Gram">Gram</option>
                <option value="Litre">Litre</option>
                <option value="Millilitre">Millilitre</option>
                <option value="Packet">Packet</option>
                <option value="Piece">Piece</option>
                <option value="Bottle">Bottle</option>
                <option value="Box">Box</option>
                <option value="Dozen">Dozen</option>
                <option value="Bundle">Bundle</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: '6px' }}>SELLING PRICE (AED)</label>
              <input
                type="number"
                step="0.01"
                name="price"
                defaultValue={currentPrice}
                required
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.95rem', fontWeight: 800, color: '#16a34a' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: '6px' }}>CURRENT STOCK</label>
              <input
                type="number"
                name="stock"
                defaultValue={currentStock}
                required
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.95rem', fontWeight: 800 }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: '6px' }}>MIN STOCK WARNING THRESHOLD</label>
              <input
                type="number"
                name="minStock"
                defaultValue={product.minStock || 5}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: '6px' }}>SUPPLIER / VENDOR</label>
              <input
                type="text"
                name="supplier"
                defaultValue={product.supplier || 'Roya Fresh Farms'}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
              />
            </div>
          </div>

          <button
            type="submit"
            style={{ background: '#16a34a', color: '#ffffff', border: 'none', padding: '16px', borderRadius: '14px', fontWeight: 900, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(22,163,74,0.3)', marginTop: '12px' }}
          >
            <Save size={20} /> SAVE PRODUCT CHANGES
          </button>
        </form>
      </div>
    </div>
  );
}
