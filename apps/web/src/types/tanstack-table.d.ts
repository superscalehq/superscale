import { UserWithMemberships } from '@superscale/crud/types';
import { Organization } from '@superscale/prisma/client';
import { RowData } from '@tanstack/react-table';

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    user: UserWithMemberships;
    organization: Organization;
  }
}
