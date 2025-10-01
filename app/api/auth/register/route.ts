// app/api/auth/register/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // 导入我们之前创建的 Prisma 客户端
import bcrypt from 'bcryptjs'; // 导入密码加密工具

// 这部分代码是处理用户注册请求的
export async function POST(request: Request) {
  try {
    // 1. 获取用户在注册页面输入的邮箱和密码
    const { email, password, name } = await request.json();

    // 2. 检查邮箱和密码是否都填写了
    if (!email || !password) {
      // 如果没填,就告诉用户"邮箱和密码不能为空"
      return NextResponse.json({ message: '邮箱和密码不能为空' }, { status: 400 });
    }

    // 3. 检查这个邮箱是不是已经被别人注册了
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    // 4. 如果邮箱已存在,就告诉用户"换个邮箱试试"
    if (existingUser) {
      return NextResponse.json({ message: '该邮箱已被注册' }, { status: 409 });
    }

    // 5. 如果一切正常,就把密码加密,这样更安全
    // 想象一下,bcrypt.hash就像一个超级密码混淆器
    const hashedPassword = await bcrypt.hash(password, 10); // 10是加密的强度,数字越大越安全,但耗时也越长

    // 6. 在数据库里创建一个新用户,把邮箱、名字和加密后的密码存进去
    await prisma.user.create({
      data: {
        email,
        name: name || email.split('@')[0], // 如果没有提供名字,就用邮箱的前半部分作为名字
        password: hashedPassword,
      },
    });

    // 7. 告诉用户"恭喜你,注册成功!"
    return NextResponse.json({ message: '用户注册成功' }, { status: 201 });
  } catch (error) {
    // 如果中间出了任何问题,就告诉系统"服务器出错了"
    console.error('注册失败:', error);
    return NextResponse.json({ message: '服务器内部错误' }, { status: 500 });
  }
}
