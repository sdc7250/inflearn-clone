import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/prisma"
import CredentialsProvider from "next-auth/providers/credentials"
import { comparePassword } from "./lib/password-utils"

export const { handlers, auth, signIn, signOut } = NextAuth({
  useSecureCookies: process.env.NODE_ENV === "production",
  trustHost: true,
  adapter: PrismaAdapter(prisma),
  secret: process.env.AUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "이메일을 입력해주세요." },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // 입력값 검증
        if (!credentials || !credentials.email || !credentials.password) {
          throw new Error("이메일과 비밀번호를 모두 입력해주세요.")
        }

        // 이메일로 유저 찾기
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user) {
          throw new Error("존재하지 않는 이메일입니다.")
        }

        // 비밀번호 매칭
        const passwordMatch = comparePassword(credentials.password as string, user.hashedPassword as string)

        if (!passwordMatch) {
          throw new Error("비밀번호가 일치하지 않습니다.")
        }

        return user
      },
    })
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
  },
  callbacks: {
  },
})