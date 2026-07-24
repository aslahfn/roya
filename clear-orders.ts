import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Delete all order items first (though cascade might handle it)
  await prisma.orderItem.deleteMany({});
  
  // Delete all orders
  await prisma.order.deleteMany({});

  console.log('Successfully cleared all orders and order items from the database.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
