# 密码管理器 (Password Manager)

这是一个使用 Next.js 和 shadcn/ui 构建的现代化、响应式的密码管理器应用。它提供了一个简洁、安全的界面来存储和管理您的密码。

## ✨ 主要功能

- **查看密码列表**：在一个清晰的表格中查看所有已保存的账号信息。
- **新增密码**：通过一个方便的对话框快速添加新的网站、用户名和密码。
- **一键复制密码**：单击按钮即可将密码复制到剪贴板，方便快捷。
- **响应式设计**：在桌面和移动设备上均有良好的视觉和使用体验。
- **深色模式**：默认启用深色主题，保护您的眼睛。
- **删除密码**：轻松删除不再需要的密码记录。

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

### 3. 配置数据库

本项目使用 PostgreSQL 数据库和 Prisma ORM。

1.  **创建 `.env` 文件**：在项目根目录，复制 `.env.example` (如果存在) 或手动创建一个名为 `.env` 的文件。

2.  **设置数据库连接**：在 `.env` 文件中，设置 `DATABASE_URL` 变量，指向您的 PostgreSQL 数据库。格式如下：

    ```
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
    ```

    > 如果您没有数据库，可以使用 [Vercel Postgres](https://vercel.com/storage/postgres) 或 [Supabase](https://supabase.com) 等云服务提供的免费数据库。

3.  **运行数据库迁移**：配置好数据库连接后，运行以下命令来创建数据库表结构：

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
- **数据库 ORM**: [Prisma](https://www.prisma.io/)
- **数据库**: [PostgreSQL](https://www.postgresql.org/)
- **通知/提示**: [Sonner](https://sonner.emilkowal.ski/)

## 展望

我们已经成功地将数据存储后端切换为 PostgreSQL 数据库，实现了数据的持久化存储。

未来的改进方向包括：

- **编辑功能**：实现修改已有密码记录的功能。
- **密码强度指示器**：在输入密码时显示其强度。
- **加密存储**：对存储的密码进行加密，提高安全性。
