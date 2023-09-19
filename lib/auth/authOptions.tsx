import { prisma } from '@/lib/db';
import { resend } from '@/lib/resend';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import GoogleProvider from 'next-auth/providers/google';
import MagicLinkEmail from '../../components/emails/magic-link';
import { serverConfig } from '../config';

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
  callbacks: {
    async jwt({ token, user }) {
      const u = await prisma.user.findFirst({
        where: {
          email: token.email,
        },
      });
      if (!u) {
        if (user) {
          token.id = user.id;
        }
        return token;
      }
      return {
        ...token,
        id: u.id,
        name: u.username,
        email: u.email,
        image: u.image,
      };
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    },
  },
};
