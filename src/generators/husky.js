import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

export async function setupHusky(lintTools, packageManager) {
  try {
    console.log('🚀 正在配置 Husky Git Hooks...');
    // 根据包管理器构建安装命令
    let installCmd;
    let installArgs;

    switch (packageManager) {
      case 'pnpm':
        installCmd = 'pnpm';
        installArgs = ['add', '--save-dev', 'husky lint-staged'];
        break;
      case 'yarn':
        installCmd = 'yarn';
        installArgs = ['add', '--dev', 'husky lint-staged'];
        break;
      case 'bun':
        installCmd = 'bun';
        installArgs = ['add', '--dev', 'husky lint-staged'];
        break;
      case 'npm':
      default:
        installCmd = 'npm';
        installArgs = ['install', '--save-dev', 'husky lint-staged'];
        break;
    }

    // 安装husky依赖
    const installDeps = spawn(installCmd, installArgs, {
      stdio: 'inherit',
      shell: true,
    });

    await new Promise((resolve, reject) => {
      installDeps.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Husky 依赖安装失败，退出码: ${code}`));
        }
      });

      installDeps.on('error', (error) => {
        reject(new Error(`Husky 依赖安装失败: ${error.message}`));
      });
    });

    // 初始化husky
    let huskyInitCmd;
    let huskyInitArgs;

    switch (packageManager) {
      case 'pnpm':
        huskyInitCmd = 'pnpm';
        huskyInitArgs = ['exec', 'husky', 'init'];
        break;
      case 'bun':
        huskyInitCmd = 'bunx';
        huskyInitArgs = ['husky', 'init'];
        break;
      case 'npx':
      case 'yarn':
      default:
        huskyInitCmd = 'npx';
        huskyInitArgs = ['husky', 'init'];
        break;
    }

    const huskyInit = spawn(huskyInitCmd, huskyInitArgs, {
      stdio: 'inherit',
      shell: true,
    });

    await new Promise((resolve, reject) => {
      huskyInit.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Husky 初始化失败，退出码: ${code}`));
        }
      });

      huskyInit.on('error', (error) => {
        reject(new Error(`Husky 初始化失败: ${error.message}`));
      });
    });

    // 创建.husky目录（如果不存在）
    const huskyDir = '.husky';
    try {
      await fs.mkdir(huskyDir, { recursive: true });
    } catch (error) {
      if (error.code !== 'EEXIST') {
        throw error;
      }
    }

    // 配置lint-staged
    const lintStagedConfig = {};

    if (lintTools.includes('eslint')) {
      lintStagedConfig['*.{js,jsx,ts,tsx,cjs,mjs}'] = [
        'eslint --fix',
        'prettier --write',
      ];
    }

    if (lintTools.includes('prettier')) {
      lintStagedConfig['*.{json,css,scss,md,yml,yaml}'] = ['prettier --write'];
    }

    // 更新package.json添加lint-staged配置
    const packageJsonPath = 'package.json';
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));

    packageJson['lint-staged'] = lintStagedConfig;

    await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));

    // 创建pre-commit钩子（如果选择了eslint或prettier）
    if (lintTools.includes('eslint') || lintTools.includes('prettier')) {
      const preCommitContent =
        '#!/usr/bin/env sh\n. "$(dirname -- "$0")/_/husky.sh"\n\nnpx lint-staged';
      await fs.writeFile(path.join(huskyDir, 'pre-commit'), preCommitContent, {
        mode: 0o755,
      });
    }

    // 创建commit-msg钩子（如果选择了commitlint）
    if (lintTools.includes('commitlint')) {
      const commitMsgContent =
        '#!/usr/bin/env sh\n. "$(dirname -- "$0")/_/husky.sh"\n\nnpx --no -- commitlint --edit ${1}';
      await fs.writeFile(path.join(huskyDir, 'commit-msg'), commitMsgContent, {
        mode: 0o755,
      });
    }

    console.log('✅ Husky Git Hooks 配置成功');
  } catch (error) {
    throw new Error(`配置 Husky Git Hooks 失败: ${error.message}`);
  }
}
