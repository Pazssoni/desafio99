/**
 * @file Seeds the database with an initial test user.
 * This script ensures that a default user is available for testing the login functionality.
 * To run, use 'npm run seed' from the 'backend' directory, or 'make seed' from the root.
 */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed script...');

  const email = 'test@example.com';
  const name = 'Test User';
  const password = 'password123';

  await prisma.user.delete({ where: { email } }).catch(() => {
  });

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
    },
  });

  console.log('Seed script finished. Test user created:');
  console.log(`- Email: ${email}`);
  console.log(`- Password: ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });