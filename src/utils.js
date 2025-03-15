import { spawn } from 'child_process';
import { writeFile, readFile } from 'fs/promises';

export async function spawnPromise(command, args) {
  const spawnProcess = spawn(command, args, {
    stdio: 'inherit',
    shell: true,
  });

  await new Promise((resolve, reject) => {
    spawnProcess.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Stylelint 配置初始化失败，退出码: ${code}`));
      }
    });

    spawnProcess.on('error', (error) => {
      reject(new Error(`Stylelint 配置初始化失败: ${error.message}`));
    });
  });
}

export async function getPackageJson() {
  try {
    const packageJsonPath = './package.json';
    const packageJsonContent = await readFile(packageJsonPath, 'utf-8');
    return JSON.parse(packageJsonContent);
  } catch (error) {
    throw new Error(`读取 package.json 文件失败: ${error.message}`);
  }
}

export async function setPackageJson(packageJson) {
  try {
    const packageJsonPath = './package.json';
    await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
  } catch (error) {
    throw new Error(`写入 package.json 文件失败: ${error.message}`);
  }
}
