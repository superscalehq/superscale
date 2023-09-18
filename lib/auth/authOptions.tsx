import MagicLinkEmail from '../../components/emails/magic-link';
import { serverConfig } from '../config';
import { prisma } from '../db';
import { resend } from '../resend';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  secret: serverConfig.NEXTAUTH_SECRET,
  pages: {
    signIn: 'sign-in',
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: serverConfig.GOOGLE_CLIENT_ID,
      clientSecret: serverConfig.GOOGLE_CLIENT_SECRET,
    }),
    EmailProvider({
      async sendVerificationRequest(params) {
        try {
          await resend.emails.send({
            from: 'no-reply@superscale.app',
            to: params.identifier,
            subject: 'Sign in to Superscale',
            react: <MagicLinkEmail link={params.url} />,
          });
        } catch (error) {
          console.log({ error });
        }
      },
    }),
  ],
};
