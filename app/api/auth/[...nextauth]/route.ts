// app/api/auth/[...nextauth]/route.ts
// 这个文件是 NextAuth 的 API 路由处理器
// [...nextauth] 是一个特殊的文件名,表示它可以处理所有以 /api/auth/ 开头的请求

import { handlers } from "@/auth";

// 导出 GET 和 POST 处理器
// 这样 NextAuth 就可以处理登录、登出、会话检查等所有认证相关的请求
export const { GET, POST } = handlers;
