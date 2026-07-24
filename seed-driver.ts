import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const driverEmail = 'driver@supermarket.com';
  
  const existingDriver = await prisma.user.findUnique({ where: { email: driverEmail } });
  
  if (!existingDriver) {
    await prisma.user.create({
      data: {
        email: driverEmail,
        name: 'Delivery Driver',
        hashedPassword: 'password123',
        role: 'DELIVERY_MANAGER',
      }
    });
    console.log('Driver seeded successfully');
  } else {
    console.log('Driver already exists');
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
