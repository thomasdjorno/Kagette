import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/lib/auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    ...authConfig.providers,
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user?.password) return null;

        const motDePasseValide = await bcrypt.compare(password, user.password);
        if (!motDePasseValide) return null;

        return {
          id: user.id,
          email: user.email,
          name: `${user.prenom} ${user.nom}`,
          image: user.photoUrl,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      const userId = (user?.id as string | undefined) ?? (token.id as string | undefined);
      if (userId) {
        const dbUser = await prisma.user.findUnique({ where: { id: userId } });
        if (dbUser) {
          token.id = dbUser.id;
          token.estDonneur = dbUser.estDonneur;
          token.estCuisinier = dbUser.estCuisinier;
          token.estAdmin = dbUser.estAdmin;
        }
      }
      return token;
    },
  },
});
