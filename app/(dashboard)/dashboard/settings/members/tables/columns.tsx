'use client';

import { OrganizationRole } from '@prisma/client';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';

interface BaseRowData {
  email: string;
  role: OrganizationRole;
}

interface MemberRowData extends BaseRowData {
  type: 'member';
  name: string;
}

interface InvitationRowData extends BaseRowData {
  type: 'invitation';
}

export type RowData = MemberRowData | InvitationRowData;

const columnHelper = createColumnHelper<RowData>();

export const columns = [
  columnHelper.accessor(
    (row) => ({
      email: row.email,
      name: row.type === 'member' ? row.name : null,
    }),
    {
      id: 'name_email',
      cell(props) {
        const v = props.cell.getValue();
        return (
          <div>
            <div>{v.name}</div>
            <div>{v.email}</div>
          </div>
        );
      },
    }
  ),
  columnHelper.accessor((row) => row.role, { id: 'role' }),
  // columnHelper.group({
  //   id: 'name_email',
  //   columns: [
  // 		columnHelper.accessor('name_email', {
  // 			cell: (row) => {
  // 				return (<div>
  // 					<div>{row.getValue()}</div>
  // 					<div>{row.email}</div>
  // 				</div>)
  // 			}
  // 		})
  //     // columnHelper.accessor(
  //     //   (row) => (row.type === 'member' ? row.name : null),
  //     //   { id: 'name' }
  //     // ),
  //     // columnHelper.accessor((row) => row.email, { id: 'email' }),
  //   ],
  // }),
];
