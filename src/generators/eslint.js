import { spawnPromise, getPackageJson, setPackageJson } from '../utils.js';

export async function generateEslintConfig(packageManager) {
  try {
    console.log('🚀 正在生成 ESLint 配置文件...');
    // 根据包管理器构建命令
    const { command, args } = buildEslintCommand(packageManager);

    // 使用选择的包管理器初始化ESLint配置
    await spawnPromise(command, args);

    // 更新 package.json
    await updateEslintConfig();

    console.log('✅ ESLint 配置文件生成成功');
  } catch (error) {
    throw new Error(`生成 ESLint 配置文件失败: ${error.message}`);
  }
}

export function buildEslintCommand(packageManager) {
  let command, args;
  switch (packageManager) {
    case 'yarn':
      command = 'yarn';
      args = ['create', '@eslint/config'];
      break;
    case 'pnpm':
      command = 'pnpm';
      args = ['create', '@eslint/config'];
      break;
    case 'bun':
      command = 'bun';
      args = ['create', '@eslint/config'];
      break;
    case 'npm':
    default:
      command = 'npm';
      args = ['init', '@eslint/config'];
      break;
  }
  return { command, args };
}

export async function updateEslintConfig() {
  // 更新 package.json
  const packageJson = await getPackageJson();
  // 添加 format 脚本
  packageJson.scripts = {
    ...(packageJson.scripts ?? {}),
    lint: 'eslint --fix',
  };
  await setPackageJson(packageJson);
}
