import { spawn } from 'child_process';
import fs from 'fs/promises';

export async function generatePrettierConfig(packageManager) {
  const prettierConfig = {
    semi: true,
    singleQuote: true,
    trailingComma: 'es5',
    printWidth: 80,
    tabWidth: 2,
    endOfLine: 'lf',
  };

  try {
    console.log('🚀 正在生成 Prettier 配置文件...');
    // 根据包管理器构建安装命令和参数
    let installCommand = packageManager;
    let installArgs = [];

    switch (packageManager) {
      case 'yarn':
        installArgs = ['add', '--dev', '--exact', 'prettier'];
        break;
      case 'pnpm':
        installArgs = ['add', '--save-dev', '--save-exact', 'prettier'];
        break;
      case 'bun':
        installArgs = ['add', '--dev', '--exact', 'prettier'];
        break;
      case 'npm':
      default:
        installArgs = ['install', '--save-dev', '--save-exact', 'prettier'];
        break;
    }

    // 安装依赖
    const installDeps = spawn(installCommand, installArgs, {
      stdio: 'inherit',
      shell: true,
    });

    await new Promise((resolve, reject) => {
      installDeps.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`依赖安装失败，退出码: ${code}`));
        }
      });

      installDeps.on('error', (error) => {
        reject(new Error(`依赖安装失败: ${error.message}`));
      });
    });

    // 写入 .prettierrc.json 文件
    await fs.writeFile(
      '.prettierrc.json',
      JSON.stringify(prettierConfig, null, 2)
    );

    console.log('✅ Prettier 配置文件生成成功');
  } catch (error) {
    throw new Error(`生成 Prettier 配置文件失败: ${error.message}`);
  }
}
