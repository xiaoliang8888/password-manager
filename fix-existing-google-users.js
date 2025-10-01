// fix-existing-google-users.js - 为已存在的 Google 用户补充 Account 记录
// 这个脚本用于修复之前通过 Google 登录但缺少 Account 记录的用户

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixExistingGoogleUsers() {
  console.log('='.repeat(60));
  console.log('正在检查并修复 Google 用户的 Account 记录...');
  console.log('='.repeat(60));
  console.log();

  try {
    // 查找所有没有密码且没有关联账户的用户
    // 这些很可能是通过 Google 登录但缺少 Account 记录的用户
    const users = await prisma.user.findMany({
      where: {
        password: null,
        emailVerified: { not: null }, // 有邮箱验证时间
      },
      include: {
        accounts: true,
      },
    });

    if (users.length === 0) {
      console.log('✅ 没有发现需要修复的用户');
      console.log();
      return;
    }

    console.log(`找到 ${users.length} 个可能需要修复的用户:\n`);

    let fixedCount = 0;
    let skippedCount = 0;

    for (const user of users) {
      console.log(`检查用户: ${user.email || user.id}`);
      console.log('-'.repeat(60));

      // 如果用户已经有 Account 记录,跳过
      if (user.accounts.length > 0) {
        console.log('  ⏭️  用户已有账户关联,跳过');
        console.log();
        skippedCount++;
        continue;
      }

      // 提示用户
      console.log('  ⚠️  用户没有密码且没有账户关联');
      console.log('  📝 这个用户很可能是通过 Google 登录创建的');
      console.log();
      console.log('  ❌ 无法自动修复:缺少 Google 账户的 providerAccountId');
      console.log('  💡 建议:让用户重新使用 Google 登录一次');
      console.log('     新的代码会自动创建正确的 Account 记录');
      console.log();
      skippedCount++;
    }

    console.log('='.repeat(60));
    console.log('修复完成');
    console.log('-'.repeat(60));
    console.log(`  修复成功: ${fixedCount} 个用户`);
    console.log(`  跳过:     ${skippedCount} 个用户`);
    console.log();

    if (skippedCount > 0) {
      console.log('📌 重要提示:');
      console.log('-'.repeat(60));
      console.log('对于没有 Account 记录的 Google 用户:');
      console.log('1. 这些用户仍然可以正常使用应用');
      console.log('2. 下次使用 Google 登录时,会自动创建 Account 记录');
      console.log('3. 或者可以让用户退出登录,然后重新用 Google 登录');
      console.log();
      console.log('操作步骤:');
      console.log('1. 在应用中点击退出登录');
      console.log('2. 点击"使用 Google 账号登录"');
      console.log('3. 选择相同的 Google 账号');
      console.log('4. 系统会自动创建 Account 记录');
      console.log();
    }

  } catch (error) {
    console.error('❌ 修复过程中出错:', error.message);
    console.log();
  } finally {
    await prisma.$disconnect();
  }
}

// 运行修复
fixExistingGoogleUsers();
