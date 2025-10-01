import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth'; // 导入 NextAuth 的认证函数

/**
 * 处理删除指定 ID 密码记录的 DELETE 请求
 * 只允许用户删除属于自己的密码记录
 * @param {Request} request - 请求对象
 * @param {{ params: { id: string } }} { params } - 包含动态路由参数的对象，这里是密码记录的 ID
 * @returns {Promise<NextResponse>} 返回成功或失败的 JSON 响应
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // 1. 获取当前登录的用户会话信息
    const session = await auth();
    
    // 2. 如果用户未登录，返回 401 未授权错误
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 });
    }

    // 3. 从动态路由参数中获取要删除的密码记录的 ID
    const { id } = await context.params;

    // 4. 先查询这条密码记录，确保它属于当前用户
    const passwordEntry = await prisma.passwordEntry.findUnique({
      where: { id },
    });

    // 5. 如果记录不存在，返回 404 错误
    if (!passwordEntry) {
      return NextResponse.json({ error: '密码记录不存在' }, { status: 404 });
    }

    // 6. 如果记录不属于当前用户，返回 403 禁止访问错误
    if (passwordEntry.userId !== session.user.id) {
      return NextResponse.json({ error: '无权删除此密码记录' }, { status: 403 });
    }

    // 7. 使用 Prisma Client 从数据库中删除指定 ID 的 PasswordEntry 记录
    await prisma.passwordEntry.delete({
      where: { id },
    });

    // 8. 返回一个空响应，表示删除成功，状态码为 204 (No Content)
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    // 如果在删除过程中发生错误，打印错误信息到控制台
    console.error(`删除密码失败:`, error);
    // 返回一个包含错误信息的 JSON 响应，状态码为 500 (Internal Server Error)
    return NextResponse.json({ error: '无法删除密码' }, { status: 500 });
  }
}
