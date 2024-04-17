import { PrismaClient } from '@prisma/client';
import { createSoftDeleteMiddleware } from 'prisma-soft-delete-middleware';

declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: PrismaClient;
}

let prismaClient: PrismaClient;
if (process.env.NODE_ENV === 'production') {
  prismaClient = new PrismaClient();
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient();
  }
  prismaClient = global.cachedPrisma;
}

// See https://github.com/prisma/prisma/issues/3398
// See https://github.com/olivierwilkinson/prisma-soft-delete-middleware/issues/12
// TODO: we should use an extension, and roll our own extension
// 1. Middleware are now deprecated by Prisma
// 2. This middleware has not been maintained in half a year.
// 3. It does not support cascading soft deletes.
// It is serviceable for now but we should replace it with our own.
prismaClient.$use(
  createSoftDeleteMiddleware({
    models: {
      Organization: true,
      OrganizationMembership: true,
    },
    defaultConfig: {
      field: 'deletedAt',
      createValue: (deleted) => (deleted ? new Date() : null),
      allowCompoundUniqueIndexWhere: true, // both OrganizationMembership and UserInvitation have compound unique indexes
    },
  })
);

export const prisma = prismaClient;
