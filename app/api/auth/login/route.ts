// app/api/auth/login/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // 导入 Prisma 客户端
import bcrypt from 'bcryptjs'; // 导入密码比对工具
import jwt from 'jsonwebtoken'; // 导入通行证制作工具

// 这部分代码是处理用户登录请求的
export async function POST(request: Request) {
  try {
    // 1. 获取用户在登录页面输入的用户名和密码
    const { username, password } = await request.json();

    // 2. 检查用户名和密码是否都填写了
    if (!username || !password) {
      return NextResponse.json({ message: '用户名和密码不能为空' }, { status: 400 });
    }

    // 3. 根据用户名在数据库里查找用户
    const user = await prisma.user.findUnique({
      where: { username },
    });

    // 4. 如果用户不存在，或者密码不正确，就告诉用户“用户名或密码错误”
    // bcrypt.compareSync 会安全地比对用户输入的密码和数据库中加密存储的密码
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return NextResponse.json({ message: '用户名或密码无效' }, { status: 401 });
    }

    // 5. 登录成功！现在为用户制作一张“通行证” (JWT)
    // 这张通行证里包含了用户的ID和用户名，并设置了有效期（比如1小时）
    // 'YOUR_SECRET_KEY' 是一个密钥，就像是制作通行证的模具，非常重要，不能泄露
    // 我们稍后会把它放到环境变量里，而不是直接写在代码里
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET || 'YOUR_SECRET_KEY', // 优先从环境变量读取密钥
      { expiresIn: '1h' } // 通行证有效期1小时
    );

    // 6. 把制作好的通行证发给用户
    return NextResponse.json({ token }, { status: 200 });

  } catch (error) {
    // 如果中间出了任何问题，就告诉系统“服务器出错了”
    console.error('登录失败:', error);
    return NextResponse.json({ message: '服务器内部错误' }, { status: 500 });
  }
}
