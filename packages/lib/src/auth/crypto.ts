import { createHash } from 'crypto';
import { authConfig } from './config';

export const hashToken = (token: string) => {
  return createHash('sha256')
    .update(`${token}${authConfig.NEXTAUTH_SECRET}`)
    .digest('hex');
};
