import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { createUser, getUserByEmail, getUserById } from './db';
import type { User } from '@/types';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = getUserByEmail.get(credentials.email as string) as User | undefined;
        
        if (!user || !user.password_hash) {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password_hash
        );

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        const existingUser = getUserByEmail.get(user.email!) as User | undefined;
        
        if (!existingUser) {
          // Create new user from Google OAuth
          const userId = uuidv4();
          createUser.run(userId, user.email!, user.name || null, user.image || null, null);
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        const dbUser = getUserByEmail.get(user.email!) as User | undefined;
        if (dbUser) {
          token.id = dbUser.id;
          token.totpEnabled = dbUser.totp_enabled === 1;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session as { totpEnabled?: boolean }).totpEnabled = token.totpEnabled as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
});

