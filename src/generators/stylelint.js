import { spawn } from 'child_process';

export async function generateStylelintConfig(packageManager) {
  try {
    console.log('🚀 正在生成 Stylelint 配置文件...');
    // 根据包管理器构建命令
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

    // 使用选择的包管理器初始化Stylelint配置
    const stylelintInit = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
    });

    await new Promise((resolve, reject) => {
      stylelintInit.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Stylelint 配置初始化失败，退出码: ${code}`));
        }
      });

      stylelintInit.on('error', (error) => {
        reject(new Error(`Stylelint 配置初始化失败: ${error.message}`));
      });
    });

    console.log('✅ Stylelint 配置文件生成成功');
  } catch (error) {
    throw new Error(`生成 Stylelint 配置文件失败: ${error.message}`);
  }
}
