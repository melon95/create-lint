import { spawn } from 'child_process';

export async function generateEslintConfig(packageManager) {
  try {
    console.log('🚀 正在生成 ESLint 配置文件...');
    // 根据包管理器构建命令
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
        args = ['init', '@eslint/config', '--yes'];
        break;
    }

    // 使用选择的包管理器初始化ESLint配置
    const eslintInit = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
    });

    await new Promise((resolve, reject) => {
      eslintInit.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`ESLint 配置初始化失败，退出码: ${code}`));
        }
      });

      eslintInit.on('error', (error) => {
        reject(new Error(`ESLint 配置初始化失败: ${error.message}`));
      });
    });

    console.log('✅ ESLint 配置文件生成成功');
  } catch (error) {
    throw new Error(`生成 ESLint 配置文件失败: ${error.message}`);
  }
}
