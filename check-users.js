// check-users.js - 检查数据库中的用户数据
// 这个脚本可以帮助你查看数据库中有哪些用户,以及他们的详细信息

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUsers() {
  console.log('='.repeat(60));
  console.log('正在检查数据库中的用户...');
  console.log('='.repeat(60));
  console.log();

  try {
    // 获取所有用户
    const users = await prisma.user.findMany({
      include: {
        passwords: true, // 包含用户的密码记录
        accounts: true,  // 包含用户的账户信息(Google登录等)
      },
    });

    if (users.length === 0) {
      console.log('❌ 数据库中没有任何用户');
      console.log();
      console.log('建议:');
      console.log('1. 尝试使用邮箱密码注册一个新账户');
      console.log('2. 或者使用 Google 账号登录');
      console.log();
      return;
    }

    console.log(`✅ 找到 ${users.length} 个用户:\n`);

    users.forEach((user, index) => {
      console.log(`用户 ${index + 1}:`);
      console.log('-'.repeat(60));
      console.log(`  ID:           ${user.id}`);
      console.log(`  邮箱:         ${user.email || '(未设置)'}`);
      console.log(`  名称:         ${user.name || '(未设置)'}`);
      console.log(`  头像:         ${user.image ? '已设置' : '(未设置)'}`);
      console.log(`  邮箱已验证:   ${user.emailVerified ? '是 (' + user.emailVerified.toLocaleString('zh-CN') + ')' : '否'}`);
      console.log(`  密码:         ${user.password ? '已设置(邮箱密码登录)' : '未设置(可能是Google登录)'}`);
      console.log(`  创建时间:     ${user.createdAt.toLocaleString('zh-CN')}`);
      console.log(`  更新时间:     ${user.updatedAt.toLocaleString('zh-CN')}`);
      
      // 显示关联的账户信息
      if (user.accounts.length > 0) {
        console.log(`  关联账户:     ${user.accounts.length} 个`);
        user.accounts.forEach((account, i) => {
          console.log(`    ${i + 1}. ${account.provider} (${account.type})`);
        });
      } else {
        console.log(`  关联账户:     无`);
      }
      
      // 显示密码记录数量
      console.log(`  密码记录数:   ${user.passwords.length} 条`);
      
      console.log();
    });

    // 统计信息
    console.log('='.repeat(60));
    console.log('统计信息:');
    console.log('-'.repeat(60));
    
    const googleUsers = users.filter(u => u.accounts.some(a => a.provider === 'google'));
    const credentialUsers = users.filter(u => u.password !== null);
    const totalPasswords = users.reduce((sum, u) => sum + u.passwords.length, 0);
    
    console.log(`  Google 登录用户:    ${googleUsers.length} 个`);
    console.log(`  邮箱密码登录用户:   ${credentialUsers.length} 个`);
    console.log(`  总密码记录数:       ${totalPasswords} 条`);
    console.log();

    // 如果有 Google 用户但没有账户记录,说明可能有问题
    const usersWithoutAccounts = users.filter(u => 
      u.password === null && u.accounts.length === 0
    );
    
    if (usersWithoutAccounts.length > 0) {
      console.log('⚠️  警告:发现异常用户');
      console.log('-'.repeat(60));
      console.log(`  有 ${usersWithoutAccounts.length} 个用户既没有密码也没有关联账户`);
      console.log('  这些用户可能是数据不完整导致的');
      console.log();
      usersWithoutAccounts.forEach((user, i) => {
        console.log(`  ${i + 1}. ${user.email || user.id}`);
      });
      console.log();
    }

  } catch (error) {
    console.error('❌ 检查用户时出错:', error.message);
    console.log();
    console.log('可能的原因:');
    console.log('1. 数据库连接失败 - 检查 .env 文件中的 DATABASE_URL');
    console.log('2. 数据库表不存在 - 运行 npx prisma migrate dev');
    console.log('3. Prisma Client 未生成 - 运行 npx prisma generate');
    console.log();
  } finally {
    await prisma.$disconnect();
  }
}

// 运行检查
checkUsers();
