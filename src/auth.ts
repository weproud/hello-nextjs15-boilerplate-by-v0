import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import { Envs } from "@/lib/env";
import { PrismaAdapter } from "@auth/prisma-adapter";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: Envs.authSecret,
  adapter: PrismaAdapter(prisma),
  trustHost: true,
  providers: [
    GoogleProvider({
      clientId: Envs.authGoogleId,
      clientSecret: Envs.authGoogleSecret,
    }),
  ],
  events: {
    createUser: async ({ user }) => {
      // 여기서 첫 가입 시 필요한 초기화 작업 수행
      await prisma.user.update({
        where: { id: user.id },
        data: {
          name: `user-${user.id}`,
          displayName: user.name,
        },
      });
    },
  },
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // 세션에 사용자 ID 추가
      if (token && session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
