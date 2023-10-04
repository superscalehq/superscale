import * as invitationCrud from '@/crud/invitation';
import * as organizationCrud from '@/crud/organization';
import * as userCrud from '@/crud/user';
import * as emails from '@/lib/email';
import { protectedProcedure, router } from '@/server/trpc';
import { OrganizationRole, UserInvitation } from '@prisma/client';
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
    await sendInvitationEmail(ctx.session.user.id, invitation, email);
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

const revokeInvitationSchema = acceptInvitationSchema;

const revokeInvitation = protectedProcedure
  .input(revokeInvitationSchema)
  .mutation(async ({ ctx, input }) => {
    const { invitationId } = input;
    await invitationCrud.deleteById(invitationId);
  });

const resendInvitationSchema = acceptInvitationSchema;
const resendInvitation = protectedProcedure
  .input(resendInvitationSchema)
  .mutation(async ({ ctx, input }) => {
    const { invitationId } = input;
    const invitation = await invitationCrud.findById(invitationId);
    if (!invitation) {
      return;
    }
    await sendInvitationEmail(
      ctx.session.user.id,
      invitation,
      invitation.email
    );
  });

async function sendInvitationEmail(
  senderUserId: string,
  invitation: NonNullable<invitationCrud.InvitationWithOrgAndInviter>,
  email: string
) {
  const inviter = await userCrud.getById(senderUserId);
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
}

export default router({
  create: createOrgHandler,
  invite,
  acceptInvitation,
  revokeInvitation,
  resendInvitation,
});
