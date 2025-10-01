// auth.ts - NextAuth 核心配置文件
// 这个文件就像是一个"安保系统的控制中心",负责管理用户的登录、注册等所有认证功能

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

// 导出 NextAuth 配置
export const { handlers, signIn, signOut, auth } = NextAuth({
  // 会话策略:使用 JWT (JSON Web Token) 来管理用户会话
  // JWT 就像是一张"电子通行证",用户登录后会获得这张通行证
  // 注意:使用 JWT 策略是为了支持 Credentials Provider(邮箱密码登录)
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
    // Google Provider:允许用户使用 Google 账号登录
    // 就像是在门口增加了一个"Google 通道",用户可以用 Google 账号直接进入
    // 注意:只有在环境变量配置且网络可访问 Google 时才启用
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })]
      : []),
    
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
    // signIn 回调:在用户登录时执行
    // 用于处理 Google 登录时的用户创建和账户关联
    async signIn({ user, account, profile }) {
      // 如果是 Google 登录
      if (account?.provider === "google") {
        try {
          // 检查邮箱是否存在
          if (!user.email) {
            console.error("Google 登录失败:未获取到用户邮箱");
            return false;
          }

          // 检查用户是否已存在
          let dbUser = await prisma.user.findUnique({
            where: { email: user.email },
          });

          if (!dbUser) {
            // 如果用户不存在,创建新用户
            dbUser = await prisma.user.create({
              data: {
                email: user.email,
                name: user.name || user.email.split('@')[0], // 如果没有名字,使用邮箱前缀
                image: user.image,
                emailVerified: new Date(),
              },
            });
            console.log("✅ 成功创建 Google 用户:", dbUser.email, "ID:", dbUser.id);
          } else {
            console.log("✅ Google 用户已存在:", dbUser.email, "ID:", dbUser.id);
          }

          // 检查是否已经有 Google 账户关联
          const existingAccount = await prisma.account.findUnique({
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              },
            },
          });

          if (!existingAccount) {
            // 创建 Account 记录,关联 Google 账户
            await prisma.account.create({
              data: {
                userId: dbUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                refresh_token: account.refresh_token,
                access_token: account.access_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                session_state: typeof account.session_state === 'string' ? account.session_state : null,
              },
            });
            console.log("✅ 成功创建 Google 账户关联");
          } else {
            console.log("✅ Google 账户关联已存在");
          }

          return true;
        } catch (error) {
          console.error("❌ 创建 Google 用户或账户关联时出错:", error);
          return false;
        }
      }
      return true;
    },

    // jwt 回调:在创建或更新 JWT 时执行
    // 这里我们把用户的 ID 添加到 JWT 中,方便后续使用
    async jwt({ token, user, account }) {
      // 如果是新登录,从数据库获取用户 ID
      if (user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.email = dbUser.email;
          token.name = dbUser.name;
          console.log("JWT 回调 - 用户信息:", { id: dbUser.id, email: dbUser.email });
        } else {
          console.error("JWT 回调 - 未找到用户:", user.email);
        }
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
