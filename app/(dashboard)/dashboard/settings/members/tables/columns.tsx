'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import { UserWithMemberships } from '@/crud/user';
import { t } from '@/lib/trpc';
import { OrganizationRole } from '@prisma/client';
import { createColumnHelper } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface BaseRowData {
  email: string;
  role: OrganizationRole;
}

interface MemberRowData extends BaseRowData {
  type: 'member';
  userId: string;
  name: string;
  imageUrl: string | null;
}

interface InvitationRowData extends BaseRowData {
  type: 'invitation';
  invitationId: string;
}

export type RowData = MemberRowData | InvitationRowData;

const columnHelper = createColumnHelper<RowData>();

const roleMap: Record<OrganizationRole, string> = {
  [OrganizationRole.OWNER]: 'Owner',
  [OrganizationRole.ADMIN]: 'Admin',
  [OrganizationRole.MEMBER]: 'Member',
};

export const columns = [
  columnHelper.display({
    id: 'image',
    size: 50,
    cell({ row: { original: data } }) {
      const imageUrl = data.type === 'member' ? data.imageUrl : undefined;
      const name = data.type === 'member' ? data.name : data.email;
      const initials = name
        .split(' ')
        .map((n) => n[0].toUpperCase())
        .join('')
        .slice(0, 2);
      return (
        <Avatar>
          <AvatarImage src={imageUrl ?? undefined} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      );
    },
  }),
  columnHelper.accessor(
    (row) => ({
      email: row.email,
      name: row.type === 'member' ? row.name : null,
      isInvitation: row.type === 'invitation',
    }),
    {
      id: 'name_email',
      cell(props) {
        const v = props.cell.getValue();
        return (
          <div className="flex flex-col">
            {v.name ? <p>{v.name}</p> : null}
            <p className="text-muted-foreground">{v.email}</p>
          </div>
        );
      },
      filterFn(row, columnId, value) {
        const v = row.getValue(columnId) as { email: string; name?: string };
        return (
          v.email.toLowerCase().includes(value) ||
          !!v.name?.toLowerCase().includes(value)
        );
      },
    }
  ),
  columnHelper.accessor((row) => roleMap[row.role], {
    id: 'role',
    cell(props) {
      const v = props.cell.getValue();
      return (
        <div className="flex flex-row items-center space-x-4">
          <p>{v}</p>
          {props.row.original.type === 'invitation' ? (
            <span className="inline-block rounded border-[1px] border-muted-foreground px-2 py-0.5 text-xs text-muted-foreground">
              Pending
            </span>
          ) : null}
        </div>
      );
    },
  }),
  columnHelper.display({
    id: 'actions',
    size: 50,
    cell(props) {
      const row = props.row;
      const { user: currentUser, organization } = props.table.options.meta!!;
      const organizationRole = currentUser.memberships.find(
        (m) => m.organization.id === organization.id
      )?.role;
      const removeMember = t.organization.removeMember.useMutation();
      const revokeInvitation = t.organization.revokeInvitation.useMutation();
      const resendInvitation = t.organization.resendInvitation.useMutation();
      const router = useRouter();
      const { toast } = useToast();
      const handleRemove = async () => {
        const { userId } = row.original as MemberRowData;
        await removeMember.mutateAsync({
          organizationId: organization.id,
          userId,
        });
        toast({ title: 'Member removed' });
        router.refresh();
      };
      const handleRevoke = async () => {
        const { invitationId } = row.original as InvitationRowData;
        await revokeInvitation.mutateAsync({ invitationId });
        toast({ title: 'Invitation revoked' });
        router.refresh();
      };
      const handleResend = async () => {
        const { invitationId } = row.original as InvitationRowData;
        await resendInvitation.mutateAsync({ invitationId });
        toast({ title: 'Invitation resent' });
        router.refresh();
      };
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {row.original.type === 'member' ? (
              <DropdownMenuItem
                onClick={handleRemove}
                disabled={
                  organizationRole !== OrganizationRole.ADMIN ||
                  currentUser.id === row.original.userId
                }
              >
                Remove
              </DropdownMenuItem>
            ) : null}
            {row.original.type === 'invitation' ? (
              <DropdownMenuItem onClick={handleRevoke}>Revoke</DropdownMenuItem>
            ) : null}
            {row.original.type === 'invitation' ? (
              <DropdownMenuItem onClick={handleResend}>Resend</DropdownMenuItem>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  }),
];
