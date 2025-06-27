import NextAuth from 'next-auth';
import { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

const client = new MongoClient(process.env.MONGODB_URI!);
const clientPromise = Promise.resolve(client);

export const authOptions: AuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          await client.connect();
          const users = client.db().collection('users');
          const user = await users.findOne({ email: credentials.email });

          if (!user) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role || 'user',
            verified: user.verified || false,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role || 'user';
        token.verified = user.verified || false;
        token.provider = account?.provider;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
        session.user.verified = token.verified as boolean;
        session.user.provider = token.provider as string;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' || account?.provider === 'github') {
        try {
          await client.connect();
          const users = client.db().collection('users');
          
          const existingUser = await users.findOne({ email: user.email });
          
          if (!existingUser) {
            // Create new user profile
            await users.insertOne({
              email: user.email,
              name: user.name,
              image: user.image,
              provider: account.provider,
              verified: true, // OAuth users are pre-verified
              role: 'user',
              createdAt: new Date(),
              profile: {
                bio: '',
                institution: '',
                researchInterests: [],
                academicLevel: '',
                orcid: '',
              },
              settings: {
                emailNotifications: true,
                profileVisibility: 'public',
                twoFactorEnabled: false,
              }
            });
          }
        } catch (error) {
          console.error('Sign in error:', error);
          return false;
        }
      }
      return true;
    }
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 