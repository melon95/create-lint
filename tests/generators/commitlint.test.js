import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  generateCommitlintConfig,
  buildCommitlintCommand,
} from '../../src/generators/commitlint.js';
import * as utils from '../../src/utils.js';

// Mock utils
vi.mock('../../src/utils.js', () => ({
  spawnPromise: vi.fn().mockResolvedValue(undefined),
  getPackageJson: vi.fn().mockResolvedValue({}),
  setPackageJson: vi.fn().mockResolvedValue(undefined),
}));

// Mock fs/promises
vi.mock('fs/promises', () => ({
  writeFile: vi.fn().mockResolvedValue(undefined),
}));

describe('generateCommitlintConfig', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('应该使用npm正确构建命令并调用spawnPromise', async () => {
    await generateCommitlintConfig('npm');

    const { command, args } = buildCommitlintCommand('npm');
    expect(utils.spawnPromise).toHaveBeenCalledWith(command, args);
    expect(command).toBe('npm');
    expect(args).toEqual([
      'install',
      '--save-dev',
      '@commitlint/cli',
      '@commitlint/config-conventional',
      '@commitlint/cz-commitlint',
      'commitizen',
      'cz-conventional-changelog',
    ]);
  });

  it('应该使用yarn正确构建命令并调用spawnPromise', async () => {
    await generateCommitlintConfig('yarn');

    const { command, args } = buildCommitlintCommand('yarn');
    expect(utils.spawnPromise).toHaveBeenCalledWith(command, args);
    expect(command).toBe('yarn');
    expect(args).toEqual([
      'add',
      '--dev',
      '@commitlint/cli',
      '@commitlint/config-conventional',
      '@commitlint/cz-commitlint',
      'commitizen',
      'cz-conventional-changelog',
    ]);
  });

  it('应该使用pnpm正确构建命令并调用spawnPromise', async () => {
    await generateCommitlintConfig('pnpm');

    const { command, args } = buildCommitlintCommand('pnpm');
    expect(utils.spawnPromise).toHaveBeenCalledWith(command, args);
    expect(command).toBe('pnpm');
    expect(args).toEqual([
      'add',
      '--save-dev',
      '@commitlint/cli',
      '@commitlint/config-conventional',
      '@commitlint/cz-commitlint',
      'commitizen',
      'cz-conventional-changelog',
    ]);
  });

  it('应该使用bun正确构建命令并调用spawnPromise', async () => {
    await generateCommitlintConfig('bun');

    const { command, args } = buildCommitlintCommand('bun');
    expect(utils.spawnPromise).toHaveBeenCalledWith(command, args);
    expect(command).toBe('bun');
    expect(args).toEqual([
      'add',
      '--dev',
      '@commitlint/cli',
      '@commitlint/config-conventional',
      '@commitlint/cz-commitlint',
      'commitizen',
      'cz-conventional-changelog',
    ]);
  });

  it('应该正确更新package.json配置', async () => {
    await generateCommitlintConfig('npm');

    expect(utils.getPackageJson).toHaveBeenCalled();
    expect(utils.setPackageJson).toHaveBeenCalledWith({
      scripts: { commit: 'cz' },
      config: { commitizen: { path: 'cz-conventional-changelog' } },
    });
  });

  it('当spawnPromise执行失败时应该抛出错误', async () => {
    const mockError = new Error('命令执行失败');
    utils.spawnPromise.mockRejectedValueOnce(mockError);

    await expect(generateCommitlintConfig('npm')).rejects.toThrow(
      '生成 Commitlint 配置文件失败: 命令执行失败'
    );
  });
});
