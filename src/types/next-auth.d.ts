import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      estDonneur: boolean;
      estCuisinier: boolean;
      estAdmin: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    estDonneur: boolean;
    estCuisinier: boolean;
    estAdmin: boolean;
  }
}
