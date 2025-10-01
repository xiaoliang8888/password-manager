// app/auth/page.tsx
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react'; // 导入 NextAuth 的登录函数
import { useRouter } from 'next/navigation'; // 导入路由导航工具
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// 这是我们的登录/注册页面组件
export default function AuthPage() {
  const router = useRouter(); // 初始化路由导航工具
  
  // 使用一个状态来切换是"登录"模式还是"注册"模式
  const [isLogin, setIsLogin] = useState(true);
  // 用来存储用户输入的邮箱
  const [email, setEmail] = useState('');
  // 用来存储用户输入的密码
  const [password, setPassword] = useState('');
  // 用来显示操作结果或错误信息
  const [message, setMessage] = useState('');
  // 用来显示加载状态
  const [isLoading, setIsLoading] = useState(false);

  // 处理表单提交的函数（无论是登录还是注册）
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // 防止页面刷新
    setMessage(''); // 清空上一条消息
    setIsLoading(true); // 开始加载

    try {
      if (isLogin) {
        // 登录模式:使用 NextAuth 的 signIn 函数
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false, // 不自动跳转,我们手动控制
        });

        if (result?.error) {
          // 如果登录失败,显示错误信息
          setMessage(result.error);
        } else if (result?.ok) {
          // 如果登录成功,显示成功消息并跳转到主页
          setMessage('登录成功！');
          setTimeout(() => {
            router.push('/');
            router.refresh(); // 刷新页面以更新会话状态
          }, 500);
        }
      } else {
        // 注册模式:调用我们的注册 API
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          // 如果注册失败,显示错误信息
          setMessage(data.message || '注册失败');
        } else {
          // 如果注册成功,提示用户并切换到登录模式
          setMessage('注册成功！请登录。');
          setTimeout(() => {
            setIsLogin(true);
            setMessage('');
          }, 1500);
        }
      }
    } catch (error) {
      setMessage('网络错误，请稍后再试');
    } finally {
      setIsLoading(false); // 结束加载
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-2xl">{isLogin ? '登录' : '注册'}</CardTitle>
            <CardDescription>
              {isLogin ? '输入您的凭据以访问您的帐户。' : '创建一个新帐户。'}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">邮箱</Label>
              <Input
                id="email"
                type="email"
                placeholder="请输入邮箱"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                type="password"
                placeholder="请输入密码"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            {message && <p className={`text-sm ${message.includes('成功') ? 'text-green-500' : 'text-red-500'}`}>{message}</p>}
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? '处理中...' : (isLogin ? '登录' : '注册')}
            </Button>
            <p className="mt-4 text-xs text-center text-muted-foreground">
              {isLogin ? '还没有帐户？' : '已经有帐户了？'}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setMessage('');
                }}
                className="underline underline-offset-4 hover:text-primary ml-1"
              >
                {isLogin ? '注册' : '登录'}
              </button>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
