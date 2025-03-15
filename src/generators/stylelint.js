import { spawnPromise } from '../utils';

export async function generateStylelintConfig(packageManager) {
  try {
    console.log('🚀 正在生成 Stylelint 配置文件...');
    // 根据包管理器构建命令
    const { command, args } = buildStylelintCommand(packageManager);
    // 执行命令
    await spawnPromise(command, args);

    console.log('✅ Stylelint 配置文件生成成功');
  } catch (error) {
    throw new Error(`生成 Stylelint 配置文件失败: ${error.message}`);
  }
}

export function buildStylelintCommand(packageManager) {
  let command, args;

  switch (packageManager) {
    case 'yarn':
      command = 'yarn';
      args = ['create', 'stylelint'];
      break;
    case 'pnpm':
      command = 'pnpm';
      args = ['create', 'stylelint'];
      break;
    case 'bun':
      command = 'bun';
      args = ['create', 'stylelint'];
      break;
    case 'npm':
    default:
      command = 'npm';
      args = ['init', 'stylelint', '--yes'];
      break;
  }

  return { command, args };
}
