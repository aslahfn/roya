import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearAllData() {
  console.log('Clearing all transactional and user data...');

  // Delete child records first to honor constraints
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.customerAddress.deleteMany({});
  await prisma.priceAuditLog.deleteMany({});
  await prisma.paymentMethod.deleteMany({});

  console.log('Successfully cleared all orders, carts, addresses, and logs from the database!');
}

clearAllData()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
