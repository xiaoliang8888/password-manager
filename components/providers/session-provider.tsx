// components/providers/session-provider.tsx
// 这个组件用于包装整个应用，提供 NextAuth 的会话管理功能
'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';

// 导出一个客户端组件，用于提供会话上下文
export function SessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthSessionProvider>
      {children}
    </NextAuthSessionProvider>
  );
}
