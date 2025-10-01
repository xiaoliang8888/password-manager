# 密码管理器 (Password Manager)

这是一个使用 Next.js 和 shadcn/ui 构建的现代化、响应式的密码管理器应用。它提供了一个简洁、安全的界面来存储和管理您的密码。

## 🌟 特别说明

本项目已完整解决 **Node.js 18+ + Next.js 15 在 Windows 环境下使用代理访问 Google OAuth** 的技术难题。

- ✅ 使用 `undici` 的 `ProxyAgent` + `dispatcher` 参数
- ✅ 完美支持 V2rayN 等代理工具
- ✅ 自动跳过本地请求，提高性能
- ✅ 提供完整的测试脚本

详细技术方案请查看：[PROXY_SOLUTION.md](PROXY_SOLUTION.md)

## ✨ 主要功能

- **🔐 安全认证**：使用 NextAuth.js 进行专业的用户身份认证。
- **📧 邮箱密码登录**：使用邮箱和密码进行安全登录和注册。
- **🌐 Google 登录**：（已配置，生产环境可用）支持使用 Google 账号快速登录。
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

4.  **配置 Google OAuth（可选）**：如果您想使用 Google 账号登录功能，需要配置 Google OAuth 凭据：

    a. 访问 [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
    
    b. 创建一个新项目或选择现有项目
    
    c. 启用 "Google+ API"
    
    d. 创建 OAuth 2.0 客户端 ID：
       - 应用类型：Web 应用
       - 授权重定向 URI：`http://localhost:3000/api/auth/callback/google`（开发环境）
       - 生产环境需要添加：`https://yourdomain.com/api/auth/callback/google`
    
    e. 在 `.env` 文件中添加 Google OAuth 凭据：
    
    ```
    GOOGLE_CLIENT_ID="your-google-client-id"
    GOOGLE_CLIENT_SECRET="your-google-client-secret"
    ```
    
    > 注意：如果不配置 Google OAuth，应用仍然可以正常运行，只是无法使用 Google 登录功能。

5.  **运行数据库迁移**：配置好环境变量后，运行以下命令来创建数据库表结构：

    ```bash
    npx prisma migrate dev
    ```

### 4. 配置代理（中国大陆用户必需）

如果您在中国大陆，需要配置代理才能使用 Google 登录功能：

#### 方法 1：使用 V2rayN（推荐）

1. **以管理员身份运行 V2rayN**
2. **配置代理设置**：
   - 系统代理 → 自动配置系统代理（或 PAC 模式）
   - 路由 → 全局(Global)
3. **设置环境变量**（可选，已在代码中配置）：
   ```powershell
   $env:HTTP_PROXY = "http://127.0.0.1:10809"
   $env:HTTPS_PROXY = "http://127.0.0.1:10809"
   ```

#### 方法 2：测试代理是否工作

运行代理测试脚本：

```powershell
npm run test:proxy
```

预期输出应显示所有测试通过（✓）。

> **技术说明**：本项目使用 `undici` 的 `ProxyAgent` + `dispatcher` 参数来让 Node.js 18+ 的原生 fetch API 支持代理。这是目前唯一可靠的解决方案。

### 5. 运行开发服务器

完成以上所有步骤后，运行以下命令来启动开发服务器：

```bash
# 使用代理（自动加载 proxy-setup.js）
npm run dev

# 不使用代理（仅邮箱密码登录）
npm run dev:no-proxy
```

### 6. 打开应用

现在，在您的浏览器中打开 [http://localhost:3000](http://localhost:3000)，您就可以看到并使用这个密码管理器了。

## 🛠️ 技术栈

- **框架**: [Next.js](https://nextjs.org/) 15.5.4 (React 19)
- **UI 组件库**: [shadcn/ui](https://ui.shadcn.com/)
- **样式**: [Tailwind CSS](https://tailwindcss.com/)
- **语言**: [TypeScript](https://www.typescriptlang.org/)
- **身份认证**: [NextAuth.js](https://next-auth.js.org/) v5
- **数据库 ORM**: [Prisma](https://www.prisma.io/)
- **数据库**: [PostgreSQL](https://www.postgresql.org/)
- **通知/提示**: [Sonner](https://sonner.emilkowal.ski/)
- **代理支持**: [undici](https://undici.nodejs.org/) ProxyAgent

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
- **OAuth 2.0 认证**：支持 Google OAuth 2.0 安全登录。
- **用户隔离**：每个用户只能访问和管理自己的密码记录。
- **API 保护**：所有密码相关的 API 都需要用户登录后才能访问。
- **CSRF 保护**：NextAuth.js 自动提供 CSRF 令牌保护。

## 🌐 Google 登录使用说明

### 用户如何使用 Google 登录

1. 在登录页面，点击 **"使用 Google 账号登录"** 按钮
2. 系统会跳转到 Google 登录页面
3. 选择您的 Google 账号并授权
4. 授权成功后，会自动跳转回应用主页
5. 首次使用 Google 登录时，系统会自动创建一个新账户

### Google 登录的优势

- **更安全**：无需记忆额外的密码，使用 Google 的安全认证
- **更便捷**：一键登录，无需填写注册信息
- **账号关联**：使用相同的 Google 邮箱登录，数据会自动关联

### 注意事项

- 使用 Google 登录创建的账户，邮箱地址来自您的 Google 账号
- 如果您之前使用邮箱密码注册过相同邮箱的账户，Google 登录会关联到同一账户
- Google 登录需要网络连接到 Google 服务器

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

### 5. Google 登录失败或报错

**问题**：点击 Google 登录按钮后出现错误，如 `TypeError: fetch failed`。

**最常见原因**：网络无法访问 Google 服务器（特别是在中国大陆）或代理配置不正确。

**✅ 已解决方案**：

本项目已集成完整的代理支持，使用 `undici` 的 `ProxyAgent`。

**配置步骤**：

a. **启动 V2rayN（管理员模式）**
   - 右键 V2rayN.exe → 以管理员身份运行
   - 或在属性中设置"始终以管理员身份运行"

b. **配置 V2rayN**
   - 系统代理 → 自动配置系统代理
   - 路由 → 全局(Global)
   - 确保已连接到服务器节点

c. **测试代理**
   ```powershell
   npm run test:proxy
   ```
   应该看到所有测试通过（✓）

d. **启动开发服务器**
   ```powershell
   npm run dev
   ```

**技术原理**：
- 使用 `undici` 的 `ProxyAgent` + `dispatcher` 参数
- 这是 Node.js 18+ 原生 fetch 支持代理的唯一可靠方法
- 自动跳过本地请求（localhost, 127.0.0.1, 192.168.*）

e. **端口配置问题**
   - 如果开发服务器使用了 3001 端口，运行修复脚本：
   ```bash
   powershell -ExecutionPolicy Bypass -File fix-google-oauth.ps1
   ```
   - 然后在 Google Cloud Console 中添加重定向 URI：
   - `http://localhost:3001/api/auth/callback/google`

c. **重定向 URI 不匹配**
   - 在 Google Cloud Console 中，确保添加了正确的重定向 URI
   - 开发环境：`http://localhost:3000/api/auth/callback/google`（或 3001）
   - 生产环境：`https://yourdomain.com/api/auth/callback/google`

d. **Google Cloud 项目配置问题**
   - 确保已启用 Google+ API 或 Google People API
   - 检查 OAuth 同意屏幕是否已配置
   - 确认应用状态不是"测试中"，或者您的 Google 账号在测试用户列表中

e. **环境变量未加载**
   ```bash
   # 停止开发服务器，删除 .next 缓存，重新启动
   Remove-Item -Path ".next" -Recurse -Force
   npm run dev
   ```

**详细故障排除**：请查看 [TROUBLESHOOTING.md](TROUBLESHOOTING.md) 文件。

**临时方案**：如果 Google 登录无法使用，您仍然可以使用邮箱密码方式注册和登录。

## 🐛 已修复的问题

### Google 登录用户不显示在数据库中

**问题描述**：
使用 Google 账号登录后,虽然用户可以正常登录和使用,但数据库中缺少完整的账户关联信息。具体表现为:
- User 表中有用户记录
- 但 Account 表中没有对应的 Google 账户记录
- 导致无法正确识别用户的登录方式

**原因分析**：
1. **核心问题**:使用 JWT 策略时,NextAuth 不会自动创建 Account 记录
2. 之前的代码只在 `signIn` 回调中创建了 User,但没有创建 Account
3. Account 表用于存储第三方登录(如 Google、GitHub)的账户信息
4. 缺少 Account 记录会导致:
   - 无法追踪用户的登录方式
   - 无法刷新 Google 的访问令牌
   - 统计数据不准确

**解决方案**：
1. **创建 Account 记录**:在 `signIn` 回调中,除了创建 User,还要创建对应的 Account 记录
2. **增加邮箱验证**:在创建用户前,先检查 Google 是否返回了邮箱地址
3. **优化用户名处理**:如果 Google 没有返回用户名,使用邮箱前缀作为默认用户名
4. **添加详细日志**:使用 ✅ 和 ❌ 标记,清晰显示每个步骤的执行结果
5. **改进错误处理**:为每个可能出错的环节添加错误提示

**修改的文件**:
- `auth.ts` (第 86-157 行)
- 新增 `check-users.js` 用户检查脚本
- 新增 `test-google-login.md` 测试指南

**验证方法**:
1. 启动开发服务器:`npm run dev`
2. 使用 Google 账号登录
3. 查看终端日志,应该看到类似以下输出:
   ```
   成功创建 Google 用户: user@gmail.com ID: clx1y2b3c0000d8v9
   JWT 回调 - 用户信息: { id: 'clx1y2b3c0000d8v9', email: 'user@gmail.com' }
   ```
4. 运行用户检查脚本:`npm run check-users`
   - 这个脚本会显示数据库中所有用户的详细信息
   - 包括用户 ID、邮箱、登录方式、密码记录数等
5. 或者打开 Prisma Studio 查看数据库:`npx prisma studio`
6. 在 User 表中应该能看到 Google 登录的用户记录

**新增工具**:
- `npm run check-users`: 快速检查数据库中的所有用户信息
- `npm run fix-google-users`: 检查是否有需要修复的 Google 用户
- 详细的修复总结请查看 [GOOGLE_LOGIN_FIX_SUMMARY.md](GOOGLE_LOGIN_FIX_SUMMARY.md)
- 详细的测试指南请查看 [test-google-login.md](test-google-login.md)

## 🎯 展望

我们已经成功地集成了 NextAuth.js 身份认证系统,并实现了用户数据隔离。

未来的改进方向包括:

- **编辑功能**:实现修改已有密码记录的功能。
- **密码强度指示器**:在输入密码时显示其强度。
- **端到端加密**:对存储的密码进行端到端加密,进一步提高安全性。
- **双因素认证**:添加 2FA 支持,提供额外的安全层。
- **密码生成器**:内置强密码生成工具。
- **密码分类**:支持按类别组织密码(工作、个人、金融等)。
- **密码分享**:安全地与团队成员分享密码。

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
