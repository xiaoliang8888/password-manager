// test-proxy.js
// 代理功能测试脚本
// 运行方式: node test-proxy.js

require('./proxy-setup.js');

async function testProxy() {
  console.log('\n================================');
  console.log('代理功能测试');
  console.log('================================\n');
  
  // 测试1: 获取IP
  try {
    console.log('测试1: 获取当前IP');
    const response = await fetch('https://api.ipify.org', {
      timeout: 10000
    });
    const ip = await response.text();
    console.log('✓ 当前IP:', ip);
  } catch (error) {
    console.log('✗ IP测试失败:', error.message);
  }
  
  // 测试2: 访问Google
  try {
    console.log('\n测试2: 访问Google');
    const response = await fetch('https://www.google.com', {
      timeout: 10000
    });
    console.log('✓ Google访问成功, 状态码:', response.status);
  } catch (error) {
    console.log('✗ Google访问失败:', error.message);
  }
  
  // 测试3: 访问GitHub
  try {
    console.log('\n测试3: 访问GitHub API');
    const response = await fetch('https://api.github.com', {
      timeout: 10000
    });
    console.log('✓ GitHub访问成功, 状态码:', response.status);
  } catch (error) {
    console.log('✗ GitHub访问失败:', error.message);
  }
  
  // 测试4: 访问Google OAuth
  try {
    console.log('\n测试4: 访问Google OAuth配置');
    const response = await fetch('https://accounts.google.com/.well-known/openid-configuration', {
      timeout: 10000
    });
    console.log('✓ Google OAuth配置访问成功, 状态码:', response.status);
  } catch (error) {
    console.log('✗ Google OAuth配置访问失败:', error.message);
  }
  
  console.log('\n================================');
  console.log('测试完成');
  console.log('================================\n');
}

testProxy().catch(console.error);
