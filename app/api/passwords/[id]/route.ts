import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * 处理删除指定 ID 密码记录的 DELETE 请求
 * @param {Request} request - 请求对象
 * @param {{ params: { id: string } }} { params } - 包含动态路由参数的对象，这里是密码记录的 ID
 * @returns {Promise<NextResponse>} 返回成功或失败的 JSON 响应
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  // 从动态路由参数中获取要删除的密码记录的 ID
  const { id } = await context.params;

  try {
    // 使用 Prisma Client 从数据库中删除指定 ID 的 PasswordEntry 记录
    await prisma.passwordEntry.delete({
      where: { id },
    });

    // 返回一个空响应，表示删除成功，状态码为 204 (No Content)
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    // 如果在删除过程中发生错误，打印错误信息到控制台
    console.error(`删除 ID 为 ${id} 的密码失败:`, error);
    // 返回一个包含错误信息的 JSON 响应，状态码为 500 (Internal Server Error)
    return NextResponse.json({ error: '无法删除密码' }, { status: 500 });
  }
}
