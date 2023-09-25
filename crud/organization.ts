import { prisma } from '@/lib/db';
import { OrganizationRole } from '@prisma/client';

/**
 * Creates a new organization and adds the user as an admin.

 * @param organizationName
 * @param userId
 * @returns
 */
export async function create(organizationName: string, userId: string) {
  const organization = await prisma.organization.create({
    data: {
      name: organizationName,
      members: {
        create: {
          role: OrganizationRole.ADMIN,
          user: {
            connect: {
              id: userId,
            },
          },
        },
      },
    },
  });
  return organization;
}
