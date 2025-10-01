import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth'; // 导入 NextAuth 的认证函数

/**
 * 处理获取当前用户所有密码记录的 GET 请求
 * @returns {Promise<NextResponse>} 返回包含当前用户密码记录的 JSON 响应
 */
export async function GET() {
  try {
    // 1. 获取当前登录的用户会话信息
    const session = await auth();
    
    // 2. 如果用户未登录,返回 401 未授权错误
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 });
    }

    // 3. 使用 Prisma Client 从数据库中查询属于当前用户的所有 PasswordEntry 记录
    const passwords = await prisma.passwordEntry.findMany({
      where: {
        userId: session.user.id, // 只查询当前用户的密码记录
      },
      // 按创建时间降序排序,最新的记录会排在最前面
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    // 4. 返回查询到的密码记录,状态码为 200 (OK)
    return NextResponse.json(passwords, { status: 200 });
  } catch (error) {
    // 如果在查询过程中发生错误,打印错误信息到控制台
    console.error('获取密码列表失败:', error);
    // 返回一个包含错误信息的 JSON 响应,状态码为 500 (Internal Server Error)
    return NextResponse.json({ error: '无法获取密码列表' }, { status: 500 });
  }
}

/**
 * 处理为当前用户创建新密码记录的 POST 请求
 * @param {Request} request - 包含新密码数据的请求对象
 * @returns {Promise<NextResponse>} 返回新创建的密码记录或错误信息的 JSON 响应
 */
export async function POST(request: Request) {
  try {
    // 1. 获取当前登录的用户会话信息
    const session = await auth();
    
    // 2. 如果用户未登录,返回 401 未授权错误
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 });
    }

    // 3. 从请求体中解析出网站、用户名和密码
    const { website, username, password } = await request.json();

    // 4. 验证数据是否存在,如果缺少任何一项,则返回错误
    if (!website || !username || !password) {
      return NextResponse.json({ error: '网站、用户名和密码不能为空' }, { status: 400 });
    }

    // 5. 使用 Prisma Client 在数据库中创建一条新的 PasswordEntry 记录
    // 并自动关联到当前登录的用户
    const newPassword = await prisma.passwordEntry.create({
      data: {
        website,
        username,
        password,
        userId: session.user.id, // 关联到当前用户
      },
    });

    // 6. 返回新创建的密码记录,状态码为 201 (Created)
    return NextResponse.json(newPassword, { status: 201 });
  } catch (error) {
    // 如果在创建过程中发生错误,打印错误信息到控制台
    console.error('新增密码失败:', error);
    // 返回一个包含错误信息的 JSON 响应,状态码为 500 (Internal Server Error)
    return NextResponse.json({ error: '无法新增密码' }, { status: 500 });
  }
}
