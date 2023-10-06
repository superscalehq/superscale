import { prisma } from '@/lib/db';
import { OrganizationRole, Prisma } from '@prisma/client';

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

const memberWithUser =
  Prisma.validator<Prisma.OrganizationMembershipDefaultArgs>()({
    include: { user: true },
  });

export type MemberWithUser = Prisma.OrganizationMembershipGetPayload<
  typeof memberWithUser
>;

/**
 * Returns an organization with its members.
 * @param organizationId
 * @returns
 */
export async function members(organizationId: string) {
  return await prisma.organizationMembership.findMany({
    where: { organizationId },
    include: { user: { include: { accounts: true } } },
  });
}

export async function removeMember(organizationId: string, userId: string) {
  return await prisma.organizationMembership.deleteMany({
    where: {
      organizationId,
      userId,
    },
  });
}
