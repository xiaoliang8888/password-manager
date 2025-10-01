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

  // 处理 Google 登录的函数
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setMessage('');
    try {
      // 使用 Google 提供者进行登录
      await signIn('google', {
        callbackUrl: '/', // 登录成功后跳转到主页
      });
    } catch (error) {
      setMessage('Google 登录失败，请稍后再试');
      setIsLoading(false);
    }
  };

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
            {/* Google 登录按钮 */}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              使用 Google 账号{isLogin ? '登录' : '注册'}
            </Button>
            
            {/* 分隔线 */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  或使用邮箱
                </span>
              </div>
            </div>

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
