import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { sendEmail } from '@superscale/email';
import { prisma } from '@superscale/prisma';
import { NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import GoogleProvider, { GoogleProfile } from 'next-auth/providers/google';
import { authConfig } from './config';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  secret: authConfig.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/sign-in',
    error: '/auth/error',
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: authConfig.GOOGLE_CLIENT_ID,
      clientSecret: authConfig.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true, // we only allow Google sign ins to be linked, because we check that the email is verified
    }),
    EmailProvider({
      async sendVerificationRequest(params) {
        try {
          sendEmail(
            'no-reply@superscale.app',
            params.identifier,
            'Sign in to Superscale',
            'magicLink',
            { link: params.url }
          );
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
        name: u.name,
        email: u.email,
        image: u.image,
      };
    },
    // session is called after `jwt` callback.
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    },
    async signIn({ account, profile }) {
      if (account?.provider === 'google')
        return (profile as GoogleProfile).email_verified;
      return true;
    },
  },
};
