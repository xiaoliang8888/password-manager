// app/auth/page.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// 这是我们的登录/注册页面组件
export default function AuthPage() {
  // 使用一个状态来切换是“登录”模式还是“注册”模式
  const [isLogin, setIsLogin] = useState(true);
  // 用来存储用户输入的用户名
  const [username, setUsername] = useState('');
  // 用来存储用户输入的密码
  const [password, setPassword] = useState('');
  // 用来显示操作结果或错误信息
  const [message, setMessage] = useState('');

  // 处理表单提交的函数（无论是登录还是注册）
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // 防止页面刷新
    setMessage(''); // 清空上一条消息

    // 根据当前是登录还是注册，选择不同的后台服务地址
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

    try {
      // 向我们之前创建的后台服务发送请求
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // 如果后台返回错误，就显示错误信息
        setMessage(data.message || '操作失败');
      } else {
        if (isLogin) {
          // 如果是登录成功，后台会返回一个“通行证” (token)
          setMessage('登录成功！');
          // 我们把通行证存到浏览器的 localStorage 里，就像给用户盖了个“已入场”的章
          localStorage.setItem('token', data.token);
          // 1秒后跳转到主页
          setTimeout(() => {
            window.location.href = '/';
          }, 1000);
        } else {
          // 如果是注册成功，提示用户，并切换到登录模式
          setMessage('注册成功！请登录。');
          setIsLogin(true);
        }
      }
    } catch (error) {
      setMessage('网络错误，请稍后再试');
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
              <Label htmlFor="username">用户名</Label>
              <Input
                id="username"
                type="text"
                placeholder="请输入用户名"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
              />
            </div>
            {message && <p className={`text-sm ${message.includes('成功') ? 'text-green-500' : 'text-red-500'}`}>{message}</p>}
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button className="w-full" type="submit">
              {isLogin ? '登录' : '注册'}
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
