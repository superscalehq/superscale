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
      slug: organizationName.toLowerCase().replace(/\s/g, '-'),
      members: {
        create: {
          role: OrganizationRole.OWNER,
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

export type OrganizationWithMembers = Prisma.PromiseReturnType<
  typeof getBySlug
>;

export async function getBySlug(slug: string) {
  return await prisma.organization.findUniqueOrThrow({
    where: { slug },
    include: { members: { include: { user: true } } },
  });
}

export async function exists(name: string) {
  const [active, deleted] = await Promise.all([
    prisma.organization.count({
      where: { name, deletedAt: { not: null } },
    }),
    prisma.organization.count({
      where: { name },
    }),
  ]);
  return active + deleted > 0;
}

export async function getById(id: string) {
  return await prisma.organization.findUniqueOrThrow({
    where: { id },
    include: { members: { include: { user: true } } },
  });
}

export async function update(
  organizationId: string,
  name?: string,
  slug?: string
) {
  await prisma.organization.update({
    where: { id: organizationId },
    data: { name, slug },
  });
}

/**
 * This function cascade soft deletes all the organization's relations
 *  - OrganizationMembership
 *  - UserInvitation
 */
export async function softDelete(organizationId: string) {
  await prisma.$transaction([
    prisma.organizationMembership.deleteMany({
      where: { organizationId },
    }),
    prisma.userInvitation.deleteMany({
      where: { organizationId },
    }),
    prisma.organization.delete({
      where: { id: organizationId },
    }),
  ]);
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

export async function getMemberById(organizationId: string, userId: string) {
  return await prisma.organizationMembership.findUnique({
    where: {
      userId_organizationId: { organizationId, userId },
    },
  });
}

export async function getAdmins(organizationId: string) {
  return await prisma.organizationMembership.findMany({
    where: {
      organizationId,
      role: OrganizationRole.ADMIN,
    },
  });
}

export async function updateMemberRole(
  organizationId: string,
  userId: string,
  role: OrganizationRole
) {
  return await prisma.organizationMembership.update({
    where: {
      userId_organizationId: { userId, organizationId },
    },
    data: { role },
  });
}

export async function removeMember(organizationId: string, userId: string) {
  return await prisma.organizationMembership.delete({
    where: {
      userId_organizationId: { userId, organizationId },
    },
  });
}
