import { PrismaClient } from '@prisma/client';
import { createSoftDeleteExtension } from 'prisma-extension-soft-delete';

declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: PrismaClient;
}

let prismaClient: PrismaClient;
if (process.env.NODE_ENV === 'production') {
  prismaClient = new PrismaClient();
} else {
  if (!globalThis.cachedPrisma) {
    globalThis.cachedPrisma = new PrismaClient();
  }
  prismaClient = globalThis.cachedPrisma;
}

// See https://github.com/prisma/prisma/issues/3398
// TODO: roll our own extension
// This one does not support cascading soft deletes.
// It is serviceable for now but we should replace it with our own.
prismaClient.$extends(
  createSoftDeleteExtension({
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
