// types/next-auth.d.ts
// 这个文件用于扩展 NextAuth 的类型定义
// 让 TypeScript 知道我们在 session 和 token 中添加了自定义字段

import { DefaultSession } from "next-auth";

// 声明模块扩展
declare module "next-auth" {
  // 扩展 Session 接口,添加 id 字段
  interface Session {
    user: {
      id: string; // 用户的唯一标识符
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  // 扩展 JWT 接口,添加 id 字段
  interface JWT {
    id: string; // 用户的唯一标识符
  }
}
