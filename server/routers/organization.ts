import * as invitationCrud from '@/crud/invitation';
import * as organizationCrud from '@/crud/organization';
import * as userCrud from '@/crud/user';
import * as emails from '@/lib/email';
import { protectedProcedure, router } from '@/server/trpc';
import { OrganizationRole, UserInvitationStatus } from '@prisma/client';
import { z } from 'zod';

const createOrganizationSchema = z.object({
  organizationName: z.string(),
  userId: z.string(),
});

const createOrgHandler = protectedProcedure
  .input(createOrganizationSchema)
  .mutation(async ({ ctx, input }) => {
    await organizationCrud.create(input.organizationName, input.userId);
  });

const inviteSchema = z.object({
  email: z.string().email(),
  organizationId: z.string(),
  role: z.enum([OrganizationRole.ADMIN, OrganizationRole.MEMBER]),
});

const invite = protectedProcedure
  .input(inviteSchema)
  .mutation(async ({ ctx, input }) => {
    console.log('input: ', input);
    const { email, organizationId, role } = input;

    // if the user already exists and is associated with the organization, do nothing
    const user = await userCrud.findByEmail(email);
    if (user?.memberships.some((m) => m.organizationId === organizationId)) {
      return;
    }

    const invitation = await invitationCrud.findOrCreate(
      email,
      organizationId,
      role,
      ctx.session.user.id
    );

    // it should not be possible for an invitation to have a status of ACCEPTED at this point
    // the user should already be associated with the organization
    if (invitation.status === UserInvitationStatus.ACCEPTED) {
      return;
    }

    const inviter = await userCrud.getById(ctx.session.user.id);
    const link = emails.getInviteLink(invitation.id);
    await emails.sendEmail(
      'no-reply@superscale.app',
      email,
      `You have been invited to join ${invitation.organization.name} on Superscale`,
      'invitation',
      {
        link,
        organizationName: invitation.organization.name,
        inviterName: inviter.name!!,
        inviterEmail: inviter.email!!,
      }
    );
  });

const acceptInvitationSchema = z.object({
  invitationId: z.string(),
});

const acceptInvitation = protectedProcedure
  .input(acceptInvitationSchema)
  .mutation(async ({ ctx, input }) => {
    const { invitationId } = input;
    await invitationCrud.accept(invitationId);
  });

export default router({
  create: createOrgHandler,
  invite,
  acceptInvitation,
});
