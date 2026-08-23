import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

// Config "edge-safe" : aucune dépendance Node.js (Prisma, bcrypt) ne doit y
// être importée, car elle est aussi utilisée par le middleware (Edge Runtime).
// L'enrichissement des claims (casquettes, badge) via Prisma se fait
// uniquement dans le callback jwt de src/lib/auth.ts.
export const authConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/connexion",
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.estDonneur = (token.estDonneur as boolean) ?? false;
        session.user.estCuisinier = (token.estCuisinier as boolean) ?? false;
        session.user.estAdmin = (token.estAdmin as boolean) ?? false;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
