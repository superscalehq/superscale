'use client';

import { OrganizationRole } from '@prisma/client';
import { createColumnHelper } from '@tanstack/react-table';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface BaseRowData {
  email: string;
  role: OrganizationRole;
}

interface MemberRowData extends BaseRowData {
  type: 'member';
  name: string;
  imageUrl: string | null;
}

interface InvitationRowData extends BaseRowData {
  type: 'invitation';
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
    }
  ),
  columnHelper.accessor((row) => roleMap[row.role], {
    id: 'role',
    cell(props) {
      const v = props.cell.getValue();
      return (
        <div className="flex flex-row items-center space-x-2">
          <p>{v}</p>
          {props.row.original.type === 'invitation' ? (
            <span className="inline-block rounded border-[1px] border-muted-foreground px-2 py-1 text-xs text-muted-foreground">
              Pending
            </span>
          ) : null}
        </div>
      );
    },
  }),
];
