import { prisma } from '@/lib/db';
import { OrganizationRole, UserInvitationStatus } from '@prisma/client';
import { Prisma as P } from '@prisma/client';

export async function findOrCreate(
  email: string,
  organizationId: string,
  role: OrganizationRole,
  createdByUserId: string
) {
  const data = {
    email,
    status: UserInvitationStatus.PENDING,
    organization: {
      connect: {
        id: organizationId,
      },
    },
    createdBy: {
      connect: {
        id: createdByUserId,
      },
    },
    role,
  };

  // 2. find or create an invitation
  return prisma.userInvitation.upsert({
    where: {
      email_organizationId: {
        email,
        organizationId,
      },
    },
    update: {},
    create: data,
    include: { organization: true, createdBy: true },
  });
}

export type InvitationWithOrgAndInviter = P.PromiseReturnType<typeof findById>;

export async function findById(id: string) {
  return await prisma.userInvitation.findUnique({
    where: { id },
    include: { organization: true, createdBy: true },
  });
}

export async function accept(invitationId: string) {
  const invitation = await findById(invitationId);
  if (!invitation || invitation.status === UserInvitationStatus.ACCEPTED) {
    return;
  }

  const associateUserWithOrg = prisma.user.update({
    where: { email: invitation.email },
    data: {
      memberships: {
        create: {
          role: invitation.role,
          organization: {
            connect: {
              id: invitation.organizationId,
            },
          },
        },
      },
    },
  });
  const updateInvitation = prisma.userInvitation.update({
    where: { id: invitationId },
    data: { status: UserInvitationStatus.ACCEPTED },
  });

  await prisma.$transaction([associateUserWithOrg, updateInvitation]);
}
