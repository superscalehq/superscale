import * as crud from '@superscale/crud';
import { sendEmail } from '@superscale/email';
import { getInviteLink, getRole } from '@superscale/lib/auth';
import { OrganizationRole } from '@superscale/prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { adminProcedure, protectedProcedure, router } from '../trpc';

const existsSchema = z.object({
  nameOrSlug: z.string(),
});
const exists = protectedProcedure
  .input(existsSchema)
  .query(async ({ input }) => {
    const { nameOrSlug } = input;
    return await crud.organization.exists(nameOrSlug);
  });

const createOrganizationSchema = z.object({
  organizationName: z.string(),
  userId: z.string(),
});
const create = protectedProcedure
  .input(createOrganizationSchema)
  .mutation(async ({ ctx, input }) => {
    return await crud.organization.create(input.organizationName, input.userId);
  });

const deleteOrganizationSchema = z.object({
  organizationId: z.string(),
});
const softDelete = adminProcedure
  .input(deleteOrganizationSchema)
  .mutation(async ({ input }) => {
    const { organizationId } = input;
    await crud.organization.softDelete(organizationId);
  });

const updateOrganizationSchema = z.object({
  organizationId: z.string(),
  name: z.string().optional(),
  slug: z.string().optional(),
});
const update = adminProcedure
  .input(updateOrganizationSchema)
  .mutation(async ({ input }) => {
    const { organizationId, name, slug } = input;
    const organization = await crud.organization.getById(organizationId);
    if (!organization) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Organization not found',
      });
    }

    if (!name && !slug) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Must provide at least one field to update',
      });
    }

    if (organization.slug === slug && organization.id !== organizationId) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Slug is already taken',
      });
    }

    if (organization.name === name && organization.id !== organizationId) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Name is already taken',
      });
    }

    await crud.organization.update(organizationId, name, slug);
  });

const inviteSchema = z.object({
  email: z.string().email(),
  organizationId: z.string(),
  role: z.enum([OrganizationRole.ADMIN, OrganizationRole.MEMBER]),
});
const invite = adminProcedure
  .input(inviteSchema)
  .mutation(async ({ ctx, input }) => {
    const { email, organizationId, role } = input;

    // if the user already exists and is associated with the organization, do nothing
    const user = await crud.user.findByEmail(email);
    if (user?.memberships.some((m) => m.organizationId === organizationId)) {
      return;
    }

    const invitation = await crud.invitation.findOrCreate(
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
    await crud.invitation.accept(invitationId);
  });

const revokeInvitationSchema = acceptInvitationSchema;
const revokeInvitation = adminProcedure
  .input(revokeInvitationSchema)
  .mutation(async ({ ctx, input }) => {
    const { invitationId } = input;
    await crud.invitation.deleteById(invitationId);
  });

const resendInvitationSchema = acceptInvitationSchema;
const resendInvitation = adminProcedure
  .input(resendInvitationSchema)
  .mutation(async ({ ctx, input }) => {
    const { invitationId } = input;
    const invitation = await crud.invitation.findById(invitationId);
    if (!invitation) {
      return;
    }
    await sendInvitationEmail(ctx.user.id, invitation, invitation.email);
  });

const removeMemberSchema = z.object({
  organizationId: z.string(),
  userId: z.string(),
});
const removeMember = adminProcedure
  .input(removeMemberSchema)
  .mutation(async ({ ctx, input }) => {
    const { organizationId, userId } = input;
    if (userId === ctx.user.id) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'You cannot remove yourself from the organization',
      });
    }
    await crud.organization.removeMember(organizationId, userId);
  });

const updateMemberRoleSchema = z.object({
  organizationId: z.string(),
  userId: z.string(),
  role: z.enum([
    OrganizationRole.OWNER,
    OrganizationRole.ADMIN,
    OrganizationRole.MEMBER,
  ]),
});
const updateMemberRole = adminProcedure
  .input(updateMemberRoleSchema)
  .mutation(async ({ ctx, input }) => {
    const { organizationId, userId, role: targetRole } = input;
    const member = await crud.organization.getMemberById(
      organizationId,
      userId
    );
    if (!member) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User is not a member of this organization',
      });
    }

    if (member.role === targetRole) {
      return;
    }

    const currentUser = await crud.user.getById(ctx.user.id);
    const currentUserRole = getRole(currentUser, organizationId);

    // admins cannot change the role of owners
    if (
      currentUserRole === OrganizationRole.ADMIN &&
      (member.role === OrganizationRole.OWNER ||
        targetRole === OrganizationRole.OWNER)
    ) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Admins cannot change the role of owners',
      });
    }

    // if the downgrading from owner to non-owner, ensure there is at least one owner left
    if (
      member.role === OrganizationRole.OWNER &&
      targetRole !== OrganizationRole.OWNER
    ) {
      const owners = await crud.organization.getMembersByRole(
        organizationId,
        OrganizationRole.OWNER
      );
      if (owners.length === 1) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Organization must have at least one owner',
        });
      }
    }

    await crud.organization.updateMemberRole(
      organizationId,
      userId,
      targetRole
    );
  });

const leaveOrganizationSchema = z.object({
  organizationId: z.string(),
});
const leaveOrganization = protectedProcedure
  .input(leaveOrganizationSchema)
  .mutation(async ({ ctx, input }) => {
    const { organizationId } = input;
    const membership = await crud.organization.getMemberById(
      organizationId,
      ctx.user.id
    );
    if (!membership) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User is not a member of this organization',
      });
    }
    if (membership.role === OrganizationRole.OWNER) {
      const owners = await crud.organization.getMembersByRole(
        organizationId,
        OrganizationRole.OWNER
      );
      if (owners.length === 1) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Sole Owner cannot leave an organization',
        });
      }
    }
    await crud.organization.removeMember(organizationId, ctx.user.id, true);
  });

async function sendInvitationEmail(
  senderUserId: string,
  invitation: NonNullable<crud.invitation.InvitationWithOrgAndInviter>,
  email: string
) {
  const inviter = await crud.user.getById(senderUserId);
  const link = getInviteLink(invitation.id);
  await sendEmail(
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
  create,
  update,
  exists,
  softDelete,
  removeMember,
  updateMemberRole,
  leaveOrganization,
  invite,
  acceptInvitation,
  revokeInvitation,
  resendInvitation,
});
