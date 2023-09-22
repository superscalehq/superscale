import { prisma } from '@/lib/db';
import { Prisma as P, User } from '@prisma/client';

type UpdateUserData = Partial<Omit<User, 'id'>>;

export async function update(id: string, data: UpdateUserData) {
  return await prisma.user.update({
    where: { id },
    data,
  });
}

export type UserWithMemberships = P.PromiseReturnType<typeof getById>;

export async function getById(id: string) {
  return await prisma.user.findUniqueOrThrow({
    where: { id },
    include: { memberships: { include: { organization: true } } },
  });
}
