import { writeFile } from 'fs/promises';
import { join } from 'path';
import { getPackageJson, setPackageJson, spawnPromise } from '../utils.js';

export async function setupHusky(lintTools, packageManager) {
  try {
    console.log('🚀 正在配置 Husky Git Hooks...');
    // 获取安装命令和参数
    const { command, args } = buildHuskyInstallCommand(packageManager);
    // 执行安装命令
    await spawnPromise(command, args);

    // 获取husky初始化命令和参数
    const { command: huskyInitCmd, args: huskyInitArgs } =
      buildHuskyInitCommand(packageManager);
    // 执行husky初始化命令
    await spawnPromise(huskyInitCmd, huskyInitArgs);

    // 配置git hooks
    await configureGitHooks(lintTools);

    console.log('✅ Husky Git Hooks 配置成功');
  } catch (error) {
    throw new Error(`配置 Husky Git Hooks 失败: ${error.message}`);
  }
}

export function buildHuskyInstallCommand(packageManager) {
  let command, args;
  switch (packageManager) {
    case 'pnpm':
      command = 'pnpm';
      args = ['add', '--save-dev', 'husky lint-staged'];
      break;
    case 'yarn':
      command = 'yarn';
      args = ['add', '--dev', 'husky lint-staged'];
      break;
    case 'bun':
      command = 'bun';
      args = ['add', '--dev', 'husky lint-staged'];
      break;
    case 'npm':
    default:
      command = 'npm';
      args = ['install', '--save-dev', 'husky lint-staged'];
      break;
  }
  return { command, args };
}

export function buildHuskyInitCommand(packageManager) {
  let command, args;
  switch (packageManager) {
    case 'pnpm':
      command = 'pnpm';
      args = ['exec', 'husky', 'init'];
      break;
    case 'bun':
      command = 'bunx';
      args = ['husky', 'init'];
      break;
    case 'npx':
    case 'yarn':
    default:
      command = 'npx';
      args = ['husky', 'init'];
      break;
  }
  return { command, args };
}

export async function configureGitHooks(lintTools) {
  // .husky目录
  const huskyDir = '.husky';

  // 配置lint-staged
  const lintStagedConfig = {};

  if (lintTools.includes('eslint')) {
    lintStagedConfig['*.{js,jsx,ts,tsx,cjs,mjs}'] = ['eslint --fix'];
  }

  if (lintTools.includes('prettier')) {
    lintStagedConfig['*.{js,jsx,ts,tsx,cjs,mjs,json,css,scss,md,yml,yaml}'] = [
      'prettier --write',
    ];
  }

  // 更新package.json添加lint-staged配置
  const packageJson = await getPackageJson();

  packageJson['lint-staged'] = lintStagedConfig;

  await setPackageJson(packageJson);

  // 创建pre-commit钩子（如果选择了eslint或prettier）
  if (lintTools.includes('eslint') || lintTools.includes('prettier')) {
    const preCommitContent =
      '#!/usr/bin/env sh\n. "$(dirname -- "$0")/_/husky.sh"\n\nnpx lint-staged';
    await writeFile(join(huskyDir, 'pre-commit'), preCommitContent, {
      mode: 0o755,
    });
  }

  // 创建commit-msg钩子（如果选择了commitlint）
  if (lintTools.includes('commitlint')) {
    const commitMsgContent =
      '#!/usr/bin/env sh\n. "$(dirname -- "$0")/_/husky.sh"\n\nnpx --no -- commitlint --edit ${1}';
    await writeFile(join(huskyDir, 'commit-msg'), commitMsgContent, {
      mode: 0o755,
    });
  }
}
