import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding supermarket platform data...');

  // Create Branch
  const hq = await prisma.branch.upsert({
    where: { id: 'branch-hq' },
    update: {},
    create: {
      id: 'branch-hq',
      name: 'Roya Main Supermarket (HQ)',
      location: 'King Fahd Road, Riyadh',
    },
  });

  // Create Users including Fixed Admin Credentials
  const users = [
    { email: 'royasupermarket.com', name: 'Roya Administrator', role: 'SUPER_ADMIN', pass: 'roya@123' },
    { email: 'admin@royasupermarket.com', name: 'Roya Super Admin', role: 'SUPER_ADMIN', pass: 'roya@123' },
    { email: 'customer@supermarket.com', name: 'Demo Customer', role: 'CUSTOMER', pass: 'password123' },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: { hashedPassword: u.pass, role: u.role },
      create: {
        email: u.email,
        name: u.name,
        role: u.role,
        hashedPassword: u.pass,
        branchId: hq.id,
      },
    });
  }

  // Create Sample Drivers
  const drivers = [
    { name: 'Mohammed Tariq', phone: '+966551234567', vehicleNumber: 'KSA-9941 (Van)' },
    { name: 'Sami Express', phone: '+966559876543', vehicleNumber: 'KSA-3321 (Bike)' },
    { name: 'Fahad Driver', phone: '+966554433221', vehicleNumber: 'KSA-8812 (Car)' },
  ];

  for (const d of drivers) {
    const existing = await prisma.driver.findFirst({ where: { phone: d.phone } });
    if (!existing) {
      await prisma.driver.create({
        data: {
          name: d.name,
          phone: d.phone,
          vehicleNumber: d.vehicleNumber,
          branchId: hq.id,
          status: 'AVAILABLE',
        },
      });
    }
  }

  // Create Products with Units and Stock details
  const products = [
    { 
      sku: 'SKU-001', 
      name: 'Organic Fresh Bananas', 
      category: 'Produce', 
      brand: 'FreshFarms', 
      unit: 'Dozen',
      costPrice: 2.50,
      sellingPrice: 4.99,
      stockQuantity: 40,
      minStock: 10,
      maxStock: 150,
      supplier: 'Riyadh Fresh Agribusiness',
      images: '/logo.jpg'
    },
    { 
      sku: 'SKU-002', 
      name: 'Fresh Whole Milk 1L', 
      category: 'Dairy', 
      brand: 'Almarai', 
      unit: 'Litre',
      costPrice: 3.00,
      sellingPrice: 5.50,
      stockQuantity: 50,
      minStock: 15,
      maxStock: 200,
      supplier: 'Almarai Dairy Co.',
      images: '/logo.jpg'
    },
    { 
      sku: 'SKU-003', 
      name: 'Whole Wheat Fresh Bread', 
      category: 'Bakery', 
      brand: 'Lusine', 
      unit: 'Packet',
      costPrice: 1.80,
      sellingPrice: 3.50,
      stockQuantity: 30,
      minStock: 10,
      maxStock: 100,
      supplier: 'Lusine Bakery',
      images: '/logo.jpg'
    },
    { 
      sku: 'SKU-004', 
      name: 'Premium Basmati Rice 5kg', 
      category: 'Grains & Rice', 
      brand: 'Abu Bint', 
      unit: 'Kg',
      costPrice: 25.00,
      sellingPrice: 38.00,
      stockQuantity: 25,
      minStock: 5,
      maxStock: 80,
      supplier: 'National Grain Importers',
      images: '/logo.jpg'
    },
    { 
      sku: 'SKU-005', 
      name: 'Natural Pulp Orange Juice 1L', 
      category: 'Beverages', 
      brand: 'Nada', 
      unit: 'Litre',
      costPrice: 4.00,
      sellingPrice: 7.99,
      stockQuantity: 60,
      minStock: 12,
      maxStock: 180,
      supplier: 'Nada Juice Factory',
      images: '/logo.jpg'
    },
    { 
      sku: 'SKU-006', 
      name: 'Farm Fresh Brown Eggs 12 Pack', 
      category: 'Dairy', 
      brand: 'Watania', 
      unit: 'Piece',
      costPrice: 6.50,
      sellingPrice: 11.00,
      stockQuantity: 70,
      minStock: 20,
      maxStock: 250,
      supplier: 'Watania Poultry Farm',
      images: '/logo.jpg'
    },
  ];

  for (const p of products) {
    const product = await prisma.product.upsert({
      where: { sku: p.sku },
      update: {
        unit: p.unit,
        minStock: p.minStock,
        maxStock: p.maxStock,
        supplier: p.supplier,
      },
      create: {
        name: p.name,
        sku: p.sku,
        category: p.category,
        brand: p.brand,
        unit: p.unit,
        minStock: p.minStock,
        maxStock: p.maxStock,
        supplier: p.supplier,
        images: p.images,
      },
    });

    // Create Pricing
    await prisma.pricing.upsert({
      where: {
        productId_branchId: { productId: product.id, branchId: hq.id }
      },
      update: { sellingPrice: p.sellingPrice, costPrice: p.costPrice },
      create: {
        productId: product.id,
        branchId: hq.id,
        costPrice: p.costPrice,
        sellingPrice: p.sellingPrice,
      }
    });

    // Create Inventory
    await prisma.productBranch.upsert({
      where: {
        productId_branchId: { productId: product.id, branchId: hq.id }
      },
      update: { stockQuantity: p.stockQuantity },
      create: {
        productId: product.id,
        branchId: hq.id,
        stockQuantity: p.stockQuantity,
      }
    });
  }

  console.log('Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
