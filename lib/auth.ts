import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import PostgresAdapter from "@auth/pg-adapter";
import { Pool } from "pg";
import bcryptjs from "bcryptjs";

/**
 * Supabase's connection pooler presents its own certificate inside the
 * PostgreSQL SSL handshake, and that root is not in Node's default trust
 * store. Verifying it therefore fails with
 * "self-signed certificate in certificate chain", which broke every login in
 * production (`authorize` threw, so the credentials callback returned
 * `error=Configuration`).
 *
 * The connection is still TLS-encrypted. Set `DATABASE_SSL_CA` to the
 * Supabase CA (PEM contents, newlines preserved) to re-enable full
 * certificate verification.
 */
const databaseSsl = process.env.DATABASE_SSL_CA
  ? { rejectUnauthorized: true, ca: process.env.DATABASE_SSL_CA }
  : { rejectUnauthorized: false };

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: databaseSsl,
});

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string | null;
      email: string | null;
      image: string | null;
      role: string;
    };
  }
  interface User {
    role?: string;
  }
}

export const {
  handlers,
  signIn,
  signOut,
  auth,
} = NextAuth({
  adapter: PostgresAdapter(pool),
  session: { strategy: "jwt" },
  // Required for self-hosted/proxied deployments. Without it Auth.js only
  // trusts the host in development, and every /api/auth/* route returns
  // HTTP 500 "UntrustedHost" once NODE_ENV=production.
  trustHost: true,
  pages: {
    signIn: "/admin",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    Credentials({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const result = await pool.query(
          "SELECT id, email, password, name, role FROM public.users WHERE email = $1",
          [credentials.email]
        );

        const user = result.rows[0];
        if (!user || !user.password) return null;

        const valid = await bcryptjs.compare(
          credentials.password as string,
          user.password
        );
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role || "client",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role || "client";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = (token.role as string) || "client";
      }
      return session;
    },
  },
});
