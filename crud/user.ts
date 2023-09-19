import { User } from '@prisma/client';
import { Prisma } from '@/lib/db';

type UpdateUserData = Partial<Omit<User, 'id'>>;

export async function update(id: string, data: UpdateUserData) {
  const prisma = Prisma.getInstance();
  return await prisma.user.update({
    where: { id },
    data,
  });
}

export async function getById(id: string) {
  const prisma = Prisma.getInstance();
  return await prisma.user.findUnique({
    where: { id },
    include: { memberships: { include: { organization: true } } },
  });
}
