// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

// inicializar Prisma Client
const prismaClient = new PrismaClient();

async function seedData() {
  // crear dos registros de prueba
  const first_transaction = await prismaClient.transaction.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      status: 'CREATED',
      accountId: '662c081370bd2ba6b5f04e94',
      description: 'simple transaction',
    },
  });
  console.log(first_transaction);

  // ... (código para la segunda transacción)
}

// ejecutar la función seed
seedData()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // cerrar Prisma Client al final
    await prismaClient.$disconnect();
  });