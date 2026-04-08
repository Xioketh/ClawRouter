// saas-backend/src/lib/prisma.ts

import { PrismaClient } from '../generated/prisma'; // Ensure this matches your exact path
import { PrismaPg } from '@prisma/adapter-pg';

const prismaClientSingleton = () => {
  // 1. Initialize the Postgres driver adapter
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL || '',
  });

  // 2. Pass the adapter to the PrismaClient instead of a URL
  return new PrismaClient({ adapter });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;