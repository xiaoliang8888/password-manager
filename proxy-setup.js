// proxy-setup.js
// 这个文件配置 Node.js 的 fetch API 使用 V2rayN 代理
// 使用 undici 的 ProxyAgent 是唯一能让 Node.js 18+ 原生 fetch 支持代理的方法

const { HttpsProxyAgent } = require('https-proxy-agent');
const { HttpProxyAgent } = require('http-proxy-agent');

// 从环境变量读取代理地址，如果没有则使用默认值
const proxyUrl = process.env.HTTP_PROXY || process.env.HTTPS_PROXY || 'http://127.0.0.1:10809';

// 创建代理实例
const httpsAgent = new HttpsProxyAgent(proxyUrl);
const httpAgent = new HttpProxyAgent(proxyUrl);

// 设置环境变量（某些库会使用）
process.env.HTTP_PROXY = proxyUrl;
process.env.HTTPS_PROXY = proxyUrl;
process.env.NO_PROXY = 'localhost,127.0.0.1';

// 重写全局 fetch - 使用 dispatcher 而不是 agent
const { ProxyAgent } = require('undici');
const proxyAgent = new ProxyAgent(proxyUrl);

const originalFetch = globalThis.fetch;

globalThis.fetch = async (url, options = {}) => {
  const urlString = typeof url === 'string' ? url : url.toString();
  
  // 跳过本地请求（避免代理本地 API 调用）
  if (urlString.includes('localhost') || urlString.includes('127.0.0.1') || urlString.includes('192.168.')) {
    return originalFetch(url, options);
  }
  
  // 使用 undici 的 ProxyAgent（这是关键！）
  // dispatcher 参数是 undici 特有的，用于指定代理
  return originalFetch(url, {
    ...options,
    dispatcher: proxyAgent
  });
};

console.log('✓ 代理配置已加载');
console.log('  代理地址:', proxyUrl);
console.log('  方法: undici ProxyAgent + dispatcher');
console.log('  跳过本地请求: localhost, 127.0.0.1, 192.168.*');
