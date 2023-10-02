import * as invitationCrud from '@/crud/invitation';
import * as organizationCrud from '@/crud/organization';
import * as userCrud from '@/crud/user';
import * as emails from '@/lib/email';
import { protectedProcedure, router } from '@/server/trpc';
import { OrganizationRole } from '@prisma/client';
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
    const inviter = await userCrud.getById(ctx.session.user.id);
    const link = emails.getInviteLink(invitation.id);

    // this is a side effect, so this function is not strictly idempotent.
    // however, we'll just leave it here and use accept as a way to re-send the email.
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
