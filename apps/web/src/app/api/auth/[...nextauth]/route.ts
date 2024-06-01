import NextAuth from 'next-auth';
import { authOptions } from '@superscale/lib/auth/authOptions';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
