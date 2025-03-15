import { writeFile } from 'fs/promises';
import { spawnPromise, getPackageJson, setPackageJson } from '../utils.js';

const prettierConfig = {
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  printWidth: 80,
  tabWidth: 2,
  endOfLine: 'lf',
};

export async function generatePrettierConfig(packageManager) {
  try {
    console.log('🚀 正在生成 Prettier 配置文件...');
    // 获取安装命令和参数
    const { command, args } = buildPrettierCommand(packageManager);

    // 执行安装命令
    await spawnPromise(command, args);

    // 写入 .prettierrc.json 文件
    await writeFile(
      '.prettierrc.json',
      JSON.stringify(prettierConfig, null, 2)
    );

    // 更新 package.json
    await updatePrettierConfig();

    console.log('✅ Prettier 配置文件生成成功');
  } catch (error) {
    throw new Error(`生成 Prettier 配置文件失败: ${error.message}`);
  }
}

// 构建安装命令和参数的函数
export function buildPrettierCommand(pkgManager) {
  let command, args;

  switch (pkgManager) {
    case 'yarn':
      command = 'yarn';
      args = ['add', '--dev', '--exact', 'prettier'];
      break;
    case 'pnpm':
      command = 'pnpm';
      args = ['add', '--save-dev', '--save-exact', 'prettier'];
      break;
    case 'bun':
      command = 'bun';
      args = ['add', '--dev', '--exact', 'prettier'];
      break;
    case 'npm':
    default:
      command = 'npm';
      args = ['install', '--save-dev', '--save-exact', 'prettier'];
      break;
  }

  return {
    command,
    args,
  };
}

export async function updatePrettierConfig() {
  // 更新 package.json
  const packageJson = await getPackageJson();
  // 添加 format 脚本
  packageJson.scripts = {
    ...(packageJson.scripts ?? {}),
    format: 'prettier --write',
  };
  await setPackageJson(packageJson);
}
