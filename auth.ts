// auth.ts - NextAuth 核心配置文件
// 这个文件就像是一个"安保系统的控制中心",负责管理用户的登录、注册等所有认证功能

import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

// 导出 NextAuth 配置
export const { handlers, signIn, signOut, auth } = NextAuth({
  // 适配器:告诉 NextAuth 使用 Prisma 来操作数据库
  adapter: PrismaAdapter(prisma),
  
  // 会话策略:使用 JWT (JSON Web Token) 来管理用户会话
  // JWT 就像是一张"电子通行证",用户登录后会获得这张通行证
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 会话有效期:30天
  },

  // 页面配置:告诉 NextAuth 使用我们自己的登录页面
  pages: {
    signIn: "/auth", // 登录页面的路径
  },

  // 提供者配置:定义用户可以通过哪些方式登录
  providers: [
    // Credentials Provider:允许用户使用邮箱和密码登录
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "邮箱", type: "email" },
        password: { label: "密码", type: "password" },
      },
      // authorize 函数:验证用户的登录信息是否正确
      async authorize(credentials) {
        // 1. 检查用户是否填写了邮箱和密码
        if (!credentials?.email || !credentials?.password) {
          throw new Error("请输入邮箱和密码");
        }

        // 2. 在数据库中查找这个邮箱对应的用户
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        });

        // 3. 如果用户不存在或者没有设置密码,说明登录信息有误
        if (!user || !user.password) {
          throw new Error("邮箱或密码错误");
        }

        // 4. 使用 bcrypt 比对用户输入的密码和数据库中存储的加密密码
        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        // 5. 如果密码不匹配,返回错误
        if (!isPasswordValid) {
          throw new Error("邮箱或密码错误");
        }

        // 6. 验证成功!返回用户信息
        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],

  // 回调函数:在特定时刻执行的函数,用于自定义 NextAuth 的行为
  callbacks: {
    // jwt 回调:在创建或更新 JWT 时执行
    // 这里我们把用户的 ID 添加到 JWT 中,方便后续使用
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    
    // session 回调:在获取会话信息时执行
    // 这里我们把用户的 ID 添加到会话对象中
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },

  // 调试模式:在开发环境中启用,可以看到更多的日志信息
  debug: process.env.NODE_ENV === "development",
});
