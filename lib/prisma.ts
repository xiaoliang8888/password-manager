import { PrismaClient } from '@prisma/client';

// 声明一个全局变量来缓存 PrismaClient 实例
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// 在开发环境中，我们会使用全局变量来缓存 PrismaClient 实例。
// 这是为了防止在 Next.js 的热重载（Hot Reload）过程中，反复创建新的 PrismaClient 实例，
// 从而导致数据库连接数耗尽的问题。
const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;
