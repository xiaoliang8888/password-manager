# Google 登录测试指南

## 问题说明
之前使用 Google 账号登录后,用户信息没有正确保存到数据库中。

## 修复内容
已修改 `auth.ts` 文件,增强了以下功能:
1. ✅ 验证 Google 返回的邮箱地址
2. ✅ 优化用户名处理(如果没有名字,使用邮箱前缀)
3. ✅ **创建 Account 记录**:现在会正确保存 Google 账户关联信息到数据库
4. ✅ 添加详细的日志输出(带 ✅ 和 ❌ 标记)
5. ✅ 改进错误处理机制

## 问题根源
之前的代码只创建了 User 记录,但没有创建 Account 记录。Account 表用于存储第三方登录(如 Google)的账户信息。虽然用户可以登录,但数据库中缺少完整的账户关联信息。

## 测试步骤

### 步骤 1: 清理旧数据(可选)
如果你想从头测试,可以先清理数据库中的测试用户:

```powershell
# 打开 Prisma Studio
npx prisma studio
```

在 Prisma Studio 中:
1. 打开 User 表
2. 删除之前创建的 Google 测试用户(如果有)
3. 关闭 Prisma Studio

### 步骤 2: 启动开发服务器

```powershell
# 确保代理已启动(如果在中国大陆)
# 启动 V2rayN 并设置为全局模式

# 启动开发服务器
npm run dev
```

### 步骤 3: 测试 Google 登录

1. 打开浏览器访问 http://localhost:3000
2. 点击"使用 Google 账号登录"按钮
3. 选择你的 Google 账号并授权
4. **重要**:观察终端(PowerShell)的输出

### 步骤 4: 查看日志输出

成功的日志应该类似这样:

```
✅ 成功创建 Google 用户: yourname@gmail.com ID: clx1y2b3c0000d8v9
✅ 成功创建 Google 账户关联
JWT 回调 - 用户信息: { id: 'clx1y2b3c0000d8v9', email: 'yourname@gmail.com' }
```

或者如果用户已存在:

```
✅ Google 用户已存在: yourname@gmail.com ID: clx1y2b3c0000d8v9
✅ Google 账户关联已存在
JWT 回调 - 用户信息: { id: 'clx1y2b3c0000d8v9', email: 'yourname@gmail.com' }
```

如果看到错误日志:
```
Google 登录失败:未获取到用户邮箱
```
或
```
创建 Google 用户时出错: [错误信息]
```

请将完整的错误信息告诉我。

### 步骤 5: 验证数据库

**方法 1: 使用检查脚本(推荐)**

```powershell
npm run check-users
```

这个脚本会显示:
- 所有用户的详细信息
- Google 登录用户的数量
- 每个用户的关联账户信息
- 密码记录数量

成功的输出应该显示:
```
用户 X:
------------------------------------------------------------
  ID:           cmg88j3ou0000kr4wik0xqmi5
  邮箱:         yourname@gmail.com
  名称:         Your Name
  头像:         已设置
  邮箱已验证:   是 (2025/10/2 01:03:05)
  密码:         未设置(可能是Google登录)
  创建时间:     2025/10/2 01:03:05
  更新时间:     2025/10/2 01:03:05
  关联账户:     1 个
    1. google (oidc)
  密码记录数:   0 条
```

**方法 2: 使用 Prisma Studio**

```powershell
npx prisma studio
```

在 Prisma Studio 中:
1. 打开 **User 表**,检查以下字段:
   - ✅ `id`: 应该有一个唯一的 ID
   - ✅ `email`: 应该是你的 Google 邮箱
   - ✅ `name`: 应该是你的 Google 账号名称(或邮箱前缀)
   - ✅ `emailVerified`: 应该有一个时间戳
   - ✅ `password`: 应该是 `null`(因为是 Google 登录)
   - ✅ `createdAt`: 创建时间
   - ✅ `updatedAt`: 更新时间

2. 打开 **Account 表**,应该能看到 Google 账户记录:
   - ✅ `userId`: 应该关联到你的用户 ID
   - ✅ `provider`: 应该是 `google`
   - ✅ `type`: 应该是 `oidc`
   - ✅ `providerAccountId`: Google 账户的唯一标识
   - ✅ `access_token`: Google 的访问令牌

### 步骤 6: 测试密码管理功能

登录成功后:
1. 尝试添加一个新密码
2. 刷新页面,确认密码仍然存在
3. 在 Prisma Studio 的 PasswordEntry 表中,应该能看到这条记录,并且 `userId` 字段应该关联到你的 Google 用户 ID

## 常见问题

### Q1: 终端没有显示任何日志
**A**: 确保你是在开发模式下运行(`npm run dev`),并且查看的是正确的终端窗口。

### Q2: 显示"JWT 回调 - 未找到用户"
**A**: 这说明用户创建失败了。请检查:
- 数据库连接是否正常
- Prisma 是否正确配置
- 是否有数据库权限问题

### Q3: Google 登录页面无法打开
**A**: 这是网络问题,不是代码问题。请确保:
- V2rayN 已启动并设置为全局模式
- 代理端口正确(默认 10809)
- 运行 `npm run test:proxy` 确认代理工作正常

### Q4: 用户创建成功但无法保存密码
**A**: 这可能是会话问题。尝试:
1. 退出登录
2. 清除浏览器缓存
3. 重新登录

## 如果问题仍然存在

请提供以下信息:
1. 终端的完整日志输出
2. 浏览器控制台的错误信息(按 F12 打开)
3. Prisma Studio 中 User 表的截图
4. 你使用的 Node.js 版本(`node -v`)
5. 你使用的操作系统版本

将这些信息发给我,我会帮你进一步排查问题。
