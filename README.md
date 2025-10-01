# 密码管理器 (Password Manager)

这是一个使用 Next.js 和 shadcn/ui 构建的现代化、响应式的密码管理器应用。它提供了一个简洁、安全的界面来存储和管理您的密码。

## ✨ 主要功能

- **🔐 安全认证**：使用 NextAuth.js 进行专业的用户身份认证。
- **👤 用户隔离**：每个用户只能访问和管理自己的密码记录。
- **📋 查看密码列表**：在一个清晰的表格中查看所有已保存的账号信息。
- **➕ 新增密码**：通过一个方便的对话框快速添加新的网站、用户名和密码。
- **📋 一键复制密码**：单击按钮即可将密码复制到剪贴板，方便快捷。
- **📱 响应式设计**：在桌面和移动设备上均有良好的视觉和使用体验。
- **🌙 深色模式**：默认启用深色主题，保护您的眼睛。
- **🗑️ 删除密码**：轻松删除不再需要的密码记录。

## 🚀 如何开始

按照以下步骤在您的本地计算机上运行此项目。

### 1. 克隆项目

```bash
git clone https://github.com/your-username/password-manager.git
cd password-manager
```

### 2. 安装依赖

首先，请确保您已经安装了 [Node.js](https://nodejs.org/)。然后，在项目根目录打开终端，运行以下命令安装项目所需的依赖包：

```bash
npm install
```

### 3. 配置环境变量

本项目使用 PostgreSQL 数据库、Prisma ORM 和 NextAuth.js 进行身份认证。

1.  **创建 `.env` 文件**：在项目根目录，复制 `env.example` 文件并重命名为 `.env`：

    ```bash
    cp env.example .env
    ```

2.  **配置数据库连接**：在 `.env` 文件中，设置 `DATABASE_URL` 变量，指向您的 PostgreSQL 数据库。格式如下：

    ```
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
    ```

    > 如果您没有数据库，可以使用 [Vercel Postgres](https://vercel.com/storage/postgres) 或 [Supabase](https://supabase.com) 等云服务提供的免费数据库。

3.  **配置 NextAuth 密钥**：在 `.env` 文件中，设置以下变量：

    ```
    # 生成一个随机密钥用于加密会话
    NEXTAUTH_SECRET="your-secret-key-here"
    
    # 设置应用的 URL
    NEXTAUTH_URL="http://localhost:3000"
    ```

    > 你可以使用以下命令生成一个安全的随机密钥：
    > ```bash
    > openssl rand -base64 32
    > ```

4.  **运行数据库迁移**：配置好环境变量后，运行以下命令来创建数据库表结构：

    ```bash
    npx prisma migrate dev
    ```

### 4. 运行开发服务器

完成以上所有步骤后，运行以下命令来启动开发服务器：

```bash
npm run dev
```

### 3. 打开应用

现在，在您的浏览器中打开 [http://localhost:3000](http://localhost:3000)，您就可以看到并使用这个密码管理器了。

## 🛠️ 技术栈

- **框架**: [Next.js](https://nextjs.org/) (React)
- **UI 组件库**: [shadcn/ui](https://ui.shadcn.com/)
- **样式**: [Tailwind CSS](https://tailwindcss.com/)
- **语言**: [TypeScript](https://www.typescriptlang.org/)
- **身份认证**: [NextAuth.js](https://next-auth.js.org/)
- **数据库 ORM**: [Prisma](https://www.prisma.io/)
- **数据库**: [PostgreSQL](https://www.postgresql.org/)
- **通知/提示**: [Sonner](https://sonner.emilkowal.ski/)

## API 端点

以下是本应用提供的 API 端点及其详细说明。

### 密码管理 (Passwords)

#### 1. 获取所有密码

- **端点**: `GET /api/passwords`
- **描述**: 获取所有已保存的密码记录。
- **成功响应** (状态码 `200`):
  ```json
  [
    {
      "id": "clx1y2b3c0000d8v9e7f6h5g4",
      "website": "example.com",
      "username": "user@example.com",
      "password": "password123"
    }
  ]
  ```

#### 2. 新增密码

- **端点**: `POST /api/passwords`
- **描述**: 创建一条新的密码记录。
- **请求体**:
  ```json
  {
    "website": "newsite.com",
    "username": "newuser",
    "password": "newpassword456"
  }
  ```
- **成功响应** (状态码 `201`):
  ```json
  {
    "id": "clx1y3d4e0001d8v9a2b3c4d5",
    "website": "newsite.com",
    "username": "newuser",
    "password": "newpassword456"
  }
  ```

#### 3. 删除密码

- **端点**: `DELETE /api/passwords/[id]`
- **描述**: 根据指定的 `id` 删除一条密码记录。
- **URL 参数**:
  - `id` (string, required): 要删除的密码记录的唯一标识符。
- **成功响应**: 状态码 `204` (No Content)，无返回内容。
- **失败响应** (状态码 `500`):
  ```json
  {
    "error": "无法删除密码"
  }
  ```

### 用户认证 (Authentication)

本项目使用 NextAuth.js 进行身份认证，提供了更安全、更完善的用户认证功能。

#### 1. 用户注册

- **端点**: `POST /api/auth/register`
- **描述**: 注册一个新用户。
- **请求体**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **成功响应** (状态码 `201`):
  ```json
  {
    "message": "用户注册成功"
  }
  ```

#### 2. 用户登录

- **端点**: `POST /api/auth/signin`
- **描述**: 用户登录（由 NextAuth.js 自动处理）。
- **方式**: 使用 NextAuth.js 的 `signIn()` 函数进行登录。
- **前端示例**:
  ```typescript
  import { signIn } from 'next-auth/react';
  
  const result = await signIn('credentials', {
    email: 'user@example.com',
    password: 'password123',
    redirect: false,
  });
  ```

#### 3. 用户登出

- **端点**: `POST /api/auth/signout`
- **描述**: 用户登出（由 NextAuth.js 自动处理）。
- **前端示例**:
  ```typescript
  import { signOut } from 'next-auth/react';
  
  await signOut({ redirect: false });
  ```

#### 4. 获取会话信息

- **前端示例**:
  ```typescript
  import { useSession } from 'next-auth/react';
  
  const { data: session, status } = useSession();
  ```

## 🔒 安全特性

本项目已集成 NextAuth.js，提供了以下安全特性：

- **会话管理**：使用 JWT (JSON Web Token) 进行安全的会话管理。
- **密码加密**：使用 bcrypt 对用户密码进行加密存储。
- **用户隔离**：每个用户只能访问和管理自己的密码记录。
- **API 保护**：所有密码相关的 API 都需要用户登录后才能访问。
- **CSRF 保护**：NextAuth.js 自动提供 CSRF 令牌保护。

## ❓ 常见问题

### 1. TypeScript 报错：找不到 email 或 name 属性

**问题**：在集成 NextAuth.js 后，TypeScript 提示 User 类型上不存在 `email` 或 `name` 属性。

**解决方案**：
```bash
# 1. 停止开发服务器
# 2. 重新生成 Prisma Client
npx prisma generate

# 3. 清理 Next.js 缓存
Remove-Item -Path ".next" -Recurse -Force

# 4. 重启 IDE 或重新加载窗口
# 5. 重新启动开发服务器
npm run dev
```

### 2. NextAuth 报错：Please define a `secret`

**问题**：启动应用时提示需要定义 secret。

**解决方案**：在 `.env` 文件中添加 `NEXTAUTH_SECRET`：
```bash
# 使用 Node.js 生成随机密钥
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# 将生成的密钥添加到 .env 文件
NEXTAUTH_SECRET="生成的密钥"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. 数据库迁移失败或数据丢失

**问题**：运行 `prisma migrate dev` 时提示会丢失数据。

**解决方案**：
- 如果是开发环境且数据不重要，使用 `npx prisma db push --accept-data-loss`
- 如果需要保留数据，请先备份数据库，然后手动迁移

### 4. 端口 3000 被占用

**问题**：启动时提示端口 3000 已被使用。

**解决方案**：
```bash
# Windows PowerShell - 查找并结束占用端口的进程
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force

# 或者使用其他端口
npm run dev -- -p 3001
```

## 🎯 展望

我们已经成功地集成了 NextAuth.js 身份认证系统，并实现了用户数据隔离。

未来的改进方向包括：

- **编辑功能**：实现修改已有密码记录的功能。
- **密码强度指示器**：在输入密码时显示其强度。
- **端到端加密**：对存储的密码进行端到端加密，进一步提高安全性。
- **双因素认证**：添加 2FA 支持，提供额外的安全层。
- **密码生成器**：内置强密码生成工具。
- **密码分类**：支持按类别组织密码（工作、个人、金融等）。
- **密码分享**：安全地与团队成员分享密码。

## 🤝 贡献

欢迎贡献代码、报告问题或提出新功能建议！

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 📄 许可证

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。

## 📧 联系方式

如有问题或建议，欢迎通过以下方式联系：

- 提交 [Issue](https://github.com/your-username/password-manager/issues)
- 发送邮件至：your-email@example.com

---

**⭐ 如果这个项目对你有帮助，请给它一个星标！**
