import { createHash } from 'crypto';
import { serverConfig } from '@/lib/config';

export const hashToken = (token: string) => {
  return createHash('sha256')
    .update(`${token}${serverConfig.NEXTAUTH_SECRET}`)
    .digest('hex');
};
