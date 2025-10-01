# Node.js + Next.js 15 代理解决方案

## 🎯 问题背景

在 Windows 环境下，使用 Next.js 15 + Node.js 18+ 开发时，Google OAuth 登录会出现 `TypeError: fetch failed` 错误。这是因为：

1. **网络限制**：中国大陆无法直接访问 Google 服务器
2. **技术限制**：Node.js 18+ 使用的原生 `fetch` API（基于 undici）不支持传统的代理配置方法

## ❌ 无效的解决方案

我们尝试过以下方法，但都**无法解决问题**：

### 1. 环境变量（无效）
```powershell
$env:HTTP_PROXY = "http://127.0.0.1:10809"
$env:HTTPS_PROXY = "http://127.0.0.1:10809"
```
**原因**：undici 不读取这些环境变量

### 2. global-agent（无效）
```javascript
const { bootstrap } = require('global-agent');
bootstrap();
```
**原因**：global-agent 无法拦截 undici 的请求

### 3. V2rayN 系统代理（无效）
- 启用系统代理
- 启用路由全局模式

**原因**：undici 在 Windows 上不使用系统代理设置

## ✅ 有效的解决方案

### 核心方法：undici ProxyAgent + dispatcher

这是**唯一可靠**的解决方案！

#### 1. 安装依赖

```bash
npm install undici http-proxy-agent https-proxy-agent
```

#### 2. 创建 proxy-setup.js

```javascript
// proxy-setup.js
const { ProxyAgent } = require('undici');

const proxyUrl = process.env.HTTP_PROXY || 'http://127.0.0.1:10809';
const proxyAgent = new ProxyAgent(proxyUrl);

const originalFetch = globalThis.fetch;

globalThis.fetch = async (url, options = {}) => {
  const urlString = typeof url === 'string' ? url : url.toString();
  
  // 跳过本地请求
  if (urlString.includes('localhost') || 
      urlString.includes('127.0.0.1') || 
      urlString.includes('192.168.')) {
    return originalFetch(url, options);
  }
  
  // 关键：使用 dispatcher 参数！
  return originalFetch(url, {
    ...options,
    dispatcher: proxyAgent
  });
};

console.log('✓ 代理配置已加载');
console.log('  代理地址:', proxyUrl);
```

#### 3. 修改 package.json

```json
{
  "scripts": {
    "dev": "node -r ./proxy-setup.js node_modules/next/dist/bin/next dev --turbopack"
  }
}
```

#### 4. 配置 V2rayN

**重要**：必须以管理员身份运行！

1. 右键 V2rayN.exe → 以管理员身份运行
2. 系统代理 → 自动配置系统代理
3. 路由 → 全局(Global)
4. 确保已连接到服务器节点

#### 5. 测试

创建 `test-proxy.js`：

```javascript
require('./proxy-setup.js');

async function test() {
  try {
    const response = await fetch('https://www.google.com');
    console.log('✓ 成功:', response.status);
  } catch (error) {
    console.log('✗ 失败:', error.message);
  }
}

test();
```

运行测试：
```bash
node test-proxy.js
```

## 🔑 关键要点

### 1. dispatcher 参数是关键

```javascript
fetch(url, {
  dispatcher: proxyAgent  // 这是 undici 特有的参数！
})
```

**不要使用**：
- ❌ `agent` 参数（不起作用）
- ❌ 环境变量（undici 不读取）
- ❌ global-agent（无法拦截 undici）

### 2. V2rayN 必须以管理员身份运行

在 Windows 上，V2rayN 需要管理员权限才能正确设置系统代理和路由规则。

### 3. 跳过本地请求

```javascript
if (urlString.includes('localhost') || 
    urlString.includes('127.0.0.1') || 
    urlString.includes('192.168.')) {
  return originalFetch(url, options);
}
```

这样可以避免代理本地 API 调用，提高性能。

### 4. 使用 -r 参数预加载

```bash
node -r ./proxy-setup.js node_modules/next/dist/bin/next dev
```

`-r` 参数确保在 Next.js 启动前就加载代理配置。

## 📊 工作原理

```
用户请求 Google OAuth
    ↓
Next.js / NextAuth
    ↓
Node.js fetch (undici)
    ↓
globalThis.fetch (被重写)
    ↓
检查是否为本地请求
    ↓ 否
使用 ProxyAgent + dispatcher
    ↓
V2rayN (127.0.0.1:10809)
    ↓
境外服务器
    ↓
Google OAuth 服务器
```

## 🎓 技术细节

### undici 的特殊性

undici 是 Node.js 18+ 的 HTTP 客户端，它：
- 不使用传统的 `http.Agent`
- 不读取 `HTTP_PROXY` 环境变量
- 在 Windows 上不使用系统代理
- **只支持** `dispatcher` 参数来配置代理

### ProxyAgent vs HttpProxyAgent

- `HttpProxyAgent` (http-proxy-agent)：用于传统的 http 模块
- `ProxyAgent` (undici)：专门用于 undici 的 fetch

在 Next.js 15 中，必须使用 undici 的 `ProxyAgent`。

## 🚀 生产环境

**重要**：代理配置仅用于本地开发！

在生产环境：
- 部署到境外服务器（Vercel、AWS、Cloudflare 等）
- 这些服务器可以直接访问 Google，无需代理
- 不要在生产环境配置代理

## 📝 总结

| 方法 | 是否有效 | 原因 |
|------|---------|------|
| 环境变量 | ❌ | undici 不读取 |
| global-agent | ❌ | 无法拦截 undici |
| 系统代理 | ❌ | undici 在 Windows 上不使用 |
| **undici ProxyAgent + dispatcher** | ✅ | **唯一可靠的方法** |

## 🔗 参考资料

- [undici 文档](https://undici.nodejs.org/)
- [undici ProxyAgent](https://undici.nodejs.org/#/docs/api/ProxyAgent)
- [Node.js fetch API](https://nodejs.org/dist/latest-v18.x/docs/api/globals.html#fetch)
- [Next.js 15 发布说明](https://nextjs.org/blog/next-15)

---

**最后更新**：2025-10-02  
**测试环境**：Windows 11 + Node.js 20 + Next.js 15.5.4 + V2rayN
