import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  generatePrettierConfig,
  buildPrettierCommand,
} from '../../src/generators/prettier.js';
import * as utils from '../../src/utils.js';

// Mock utils
vi.mock('../../src/utils.js', () => ({
  spawnPromise: vi.fn().mockResolvedValue(undefined),
}));
// Mock fs/promises
vi.mock('fs/promises', () => {
  return {
    writeFile: vi.fn().mockResolvedValue(undefined),
  };
});

describe('generatePrettierConfig', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('应该使用npm正确构建命令并调用spawnPromise', async () => {
    await generatePrettierConfig('npm');

    const { command, args } = buildPrettierCommand('npm');
    expect(utils.spawnPromise).toHaveBeenCalledWith(command, args);
    expect(command).toBe('npm');
    expect(args).toEqual(['install', '--save-dev', '--save-exact', 'prettier']);
  });

  it('应该使用yarn正确构建命令并调用spawnPromise', async () => {
    await generatePrettierConfig('yarn');

    const { command, args } = buildPrettierCommand('yarn');
    expect(utils.spawnPromise).toHaveBeenCalledWith(command, args);
    expect(command).toBe('yarn');
    expect(args).toEqual(['add', '--dev', '--exact', 'prettier']);
  });

  it('应该使用pnpm正确构建命令并调用spawnPromise', async () => {
    await generatePrettierConfig('pnpm');

    const { command, args } = buildPrettierCommand('pnpm');
    expect(utils.spawnPromise).toHaveBeenCalledWith(command, args);
    expect(command).toBe('pnpm');
    expect(args).toEqual(['add', '--save-dev', '--save-exact', 'prettier']);
  });

  it('应该使用bun正确构建命令并调用spawnPromise', async () => {
    await generatePrettierConfig('bun');

    const { command, args } = buildPrettierCommand('bun');
    expect(utils.spawnPromise).toHaveBeenCalledWith(command, args);
    expect(command).toBe('bun');
    expect(args).toEqual(['add', '--dev', '--exact', 'prettier']);
  });

  it('当spawnPromise执行失败时应该抛出错误', async () => {
    const mockError = new Error('命令执行失败');
    utils.spawnPromise.mockRejectedValueOnce(mockError);

    await expect(generatePrettierConfig('npm')).rejects.toThrow(
      '生成 Prettier 配置文件失败: 命令执行失败'
    );
  });
});
