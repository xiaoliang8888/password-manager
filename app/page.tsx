"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'; // 导入导航员
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// 定义密码数据结构类型
interface Password {
  id: string;
  website: string;
  username: string;
  password: string;
}


export default function HomePage() {
  const router = useRouter(); // 初始化导航员
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [open, setOpen] = useState(false);
  const [newPassword, setNewPassword] = useState({ website: "", username: "", password: "" });
  const [isLoading, setIsLoading] = useState(true); // 添加一个加载状态，用于身份验证

  // 定义获取密码列表的函数
  const fetchPasswords = async () => {
    try {
      const response = await fetch('/api/passwords');
      if (!response.ok) {
        throw new Error('获取密码列表失败');
      }
      const data = await response.json();
      setPasswords(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '未知错误');
    }
  };

  // 在组件首次加载时，检查用户是否登录
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // 如果没有通行证，就导航到登录页面
      router.push('/auth');
    } else {
      // 如果有通行证，就获取密码列表并关闭加载状态
      fetchPasswords();
      setIsLoading(false);
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewPassword((prev) => ({ ...prev, [id]: value }));
  };

    const handleSave = async () => {
    if (!newPassword.website || !newPassword.username || !newPassword.password) {
      toast.error("请填写所有字段");
      return;
    }

    try {
      const response = await fetch('/api/passwords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPassword),
      });

      if (!response.ok) {
        throw new Error('保存失败');
      }

      // 重新获取列表以显示新添加的密码
      fetchPasswords(); 
      setNewPassword({ website: "", username: "", password: "" });
      setOpen(false);
      toast.success("密码已成功保存！");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '未知错误');
    }
  };

  const handleCopy = (password: string) => {
    navigator.clipboard.writeText(password);
    toast.success("密码已复制到剪贴板！");
  };

    const handleLogout = () => {
    // 从浏览器中移除通行证
    localStorage.removeItem('token');
    toast.success('您已成功退出登录');
    // 导航回登录页面
    router.push('/auth');
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/passwords/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('删除失败');
      }

      // 重新获取列表以移除已删除的密码
      fetchPasswords(); 
      toast.success("密码已成功删除！");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '未知错误');
    }
  };

  // 在身份验证完成前，显示一个加载提示
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>正在验证身份...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">我的密码保险箱</h1>
          <div className="flex items-center gap-4">
            <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>新增密码</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>新增密码</DialogTitle>
                <DialogDescription>
                  在这里填写新账号的信息。点击保存后会添加到列表。
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="website" className="text-right">
                    网站
                  </Label>
                  <Input id="website" placeholder="例如：Google" className="col-span-3" value={newPassword.website} onChange={handleInputChange} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    用户名
                  </Label>
                  <Input id="username" placeholder="例如：user@gmail.com" className="col-span-3" value={newPassword.username} onChange={handleInputChange} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">
                    密码
                  </Label>
                  <Input id="password" type="password" placeholder="请输入密码" className="col-span-3" value={newPassword.password} onChange={handleInputChange} />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleSave}>保存</Button>
              </DialogFooter>
            </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={handleLogout}>退出登录</Button>
          </div>
        </header>
        <main>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">网站</TableHead>
                  <TableHead>用户名</TableHead>
                  <TableHead>密码</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {passwords.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.website}</TableCell>
                    <TableCell>{item.username}</TableCell>
                    <TableCell className="font-mono">{"*".repeat(12)}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleCopy(item.password)}>复制</Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>删除</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>
    </div>
  );
}
