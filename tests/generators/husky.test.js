import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setupHusky } from '../../src/generators/husky.js';
import * as utils from '../../src/utils.js';
import { writeFile } from 'fs/promises';

// Mock modules
vi.mock('fs/promises', () => ({
  writeFile: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../../src/utils.js', () => ({
  spawnPromise: vi.fn().mockResolvedValue(undefined),
  getPackageJson: vi.fn().mockResolvedValue({}),
  setPackageJson: vi.fn().mockResolvedValue(undefined),
}));

describe('setupHusky', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('应该使用npm正确安装和配置husky', async () => {
    const lintTools = ['eslint', 'prettier', 'commitlint'];
    await setupHusky(lintTools, 'npm');

    // 验证husky安装命令
    expect(utils.spawnPromise).toHaveBeenNthCalledWith(1, 'npm', [
      'install',
      '--save-dev',
      'husky lint-staged',
    ]);

    // 验证husky初始化命令
    expect(utils.spawnPromise).toHaveBeenNthCalledWith(2, 'npx', [
      'husky',
      'init',
    ]);

    // 验证package.json更新
    expect(utils.getPackageJson).toHaveBeenCalled();
    expect(utils.setPackageJson).toHaveBeenCalledWith({
      'lint-staged': {
        '*.{js,jsx,ts,tsx,cjs,mjs}': ['eslint --fix'],
        '*.{js,jsx,ts,tsx,cjs,mjs,json,css,scss,md,yml,yaml}': [
          'prettier --write',
        ],
      },
    });

    // 验证Git hooks文件创建
    expect(writeFile).toHaveBeenCalledTimes(2);
    expect(writeFile).toHaveBeenNthCalledWith(
      1,
      '.husky/pre-commit',
      '#!/usr/bin/env sh\n. "$(dirname -- "$0")/_/husky.sh"\n\nnpx lint-staged',
      { mode: 0o755 }
    );
    expect(writeFile).toHaveBeenNthCalledWith(
      2,
      '.husky/commit-msg',
      '#!/usr/bin/env sh\n. "$(dirname -- "$0")/_/husky.sh"\n\nnpx --no -- commitlint --edit ${1}',
      { mode: 0o755 }
    );
  });

  it('应该使用yarn正确安装和配置husky', async () => {
    const lintTools = ['eslint'];
    await setupHusky(lintTools, 'yarn');

    expect(utils.spawnPromise).toHaveBeenNthCalledWith(1, 'yarn', [
      'add',
      '--dev',
      'husky lint-staged',
    ]);

    expect(utils.spawnPromise).toHaveBeenNthCalledWith(2, 'npx', [
      'husky',
      'init',
    ]);

    // 验证package.json更新
    expect(utils.getPackageJson).toHaveBeenCalled();
    expect(utils.setPackageJson).toHaveBeenCalledWith({
      'lint-staged': {
        '*.{js,jsx,ts,tsx,cjs,mjs}': ['eslint --fix'],
      },
    });
  });

  it('应该使用pnpm正确安装和配置husky', async () => {
    const lintTools = ['prettier'];
    await setupHusky(lintTools, 'pnpm');

    expect(utils.spawnPromise).toHaveBeenNthCalledWith(1, 'pnpm', [
      'add',
      '--save-dev',
      'husky lint-staged',
    ]);

    expect(utils.spawnPromise).toHaveBeenNthCalledWith(2, 'pnpm', [
      'exec',
      'husky',
      'init',
    ]);

    // 验证package.json更新
    expect(utils.getPackageJson).toHaveBeenCalled();
    expect(utils.setPackageJson).toHaveBeenCalledWith({
      'lint-staged': {
        '*.{js,jsx,ts,tsx,cjs,mjs,json,css,scss,md,yml,yaml}': [
          'prettier --write',
        ],
      },
    });
  });

  it('应该使用bun正确安装和配置husky', async () => {
    const lintTools = ['commitlint'];
    await setupHusky(lintTools, 'bun');

    expect(utils.spawnPromise).toHaveBeenNthCalledWith(1, 'bun', [
      'add',
      '--dev',
      'husky lint-staged',
    ]);

    expect(utils.spawnPromise).toHaveBeenNthCalledWith(2, 'bunx', [
      'husky',
      'init',
    ]);
  });

  it('当spawnPromise执行失败时应该抛出错误', async () => {
    const mockError = new Error('命令执行失败');
    utils.spawnPromise.mockRejectedValueOnce(mockError);

    await expect(setupHusky(['eslint'], 'npm')).rejects.toThrow(
      '配置 Husky Git Hooks 失败: 命令执行失败'
    );
  });
});
