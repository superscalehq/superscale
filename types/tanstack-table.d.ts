import { UserWithMemberships } from '@/crud/user';
import { Organization } from '@prisma/client';
import { RowData } from '@tanstack/react-table';

declare module '@tanstack/table-core' {
  interface TableMeta<TData extends RowData> {
    user: UserWithMemberships;
    organization: Organization;
  }
}
