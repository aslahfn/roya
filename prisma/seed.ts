import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding data...');

  // Create Branch
  const hq = await prisma.branch.upsert({
    where: { id: 'branch-hq' },
    update: {},
    create: {
      id: 'branch-hq',
      name: 'Main Branch (HQ)',
      location: '123 Supermarket Ave, NY',
    },
  });

  // Create Users
  const users = [
    { email: 'superadmin@supermarket.com', name: 'Alice Admin', role: 'SUPER_ADMIN' },
    { email: 'pricing@supermarket.com', name: 'Bob Pricing', role: 'PRICING_MANAGER' },
    { email: 'storemanager@supermarket.com', name: 'Charlie Store', role: 'STORE_MANAGER' },
    { email: 'customer@supermarket.com', name: 'Dave Customer', role: 'CUSTOMER' },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        email: u.email,
        name: u.name,
        role: u.role,
        hashedPassword: 'password123', // Demo purpose only
        branchId: hq.id,
      },
    });
  }

  // Create Products
  const products = [
    { sku: 'SKU-001', name: 'Organic Bananas', category: 'Produce', brand: 'FreshFarms' },
    { sku: 'SKU-002', name: 'Whole Milk 1L', category: 'Dairy', brand: 'HappyCow' },
    { sku: 'SKU-003', name: 'Whole Wheat Bread', category: 'Bakery', brand: 'DailyBake' },
  ];

  for (const p of products) {
    const product = await prisma.product.upsert({
      where: { sku: p.sku },
      update: {},
      create: {
        name: p.name,
        sku: p.sku,
        category: p.category,
        brand: p.brand,
      },
    });

    // Create Pricing for each product
    await prisma.pricing.upsert({
      where: {
        productId_branchId: { productId: product.id, branchId: hq.id }
      },
      update: {},
      create: {
        productId: product.id,
        branchId: hq.id,
        costPrice: 1.5,
        sellingPrice: 2.99,
      }
    });

    // Create Inventory for each product
    await prisma.productBranch.upsert({
      where: {
        productId_branchId: { productId: product.id, branchId: hq.id }
      },
      update: {},
      create: {
        productId: product.id,
        branchId: hq.id,
        stockQuantity: 150,
      }
    });
  }

  // Create Settings
  await prisma.settings.upsert({
    where: { key: 'CUSTOMER_APP_MODE' },
    update: {},
    create: {
      key: 'CUSTOMER_APP_MODE',
      value: 'PUBLIC', // or 'PRIVATE'
    },
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
