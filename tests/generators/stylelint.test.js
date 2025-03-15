import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  generateStylelintConfig,
  buildStylelintCommand,
} from '../../src/generators/stylelint.js';
import * as utils from '../../src/utils.js';

// Mock utils
vi.mock('../../src/utils.js', () => ({
  spawnPromise: vi.fn().mockResolvedValue(undefined),
}));

describe('generateStylelintConfig', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('应该使用npm正确构建命令并调用spawnPromise', async () => {
    await generateStylelintConfig('npm');

    const { command, args } = buildStylelintCommand('npm');
    expect(utils.spawnPromise).toHaveBeenCalledWith(command, args);
    expect(command).toBe('npm');
    expect(args).toEqual(['init', 'stylelint', '--yes']);
  });

  it('应该使用yarn正确构建命令并调用spawnPromise', async () => {
    await generateStylelintConfig('yarn');

    const { command, args } = buildStylelintCommand('yarn');
    expect(utils.spawnPromise).toHaveBeenCalledWith(command, args);
    expect(command).toBe('yarn');
    expect(args).toEqual(['create', 'stylelint']);
  });

  it('应该使用pnpm正确构建命令并调用spawnPromise', async () => {
    await generateStylelintConfig('pnpm');

    const { command, args } = buildStylelintCommand('pnpm');
    expect(utils.spawnPromise).toHaveBeenCalledWith(command, args);
    expect(command).toBe('pnpm');
    expect(args).toEqual(['create', 'stylelint']);
  });

  it('应该使用bun正确构建命令并调用spawnPromise', async () => {
    await generateStylelintConfig('bun');

    const { command, args } = buildStylelintCommand('bun');
    expect(utils.spawnPromise).toHaveBeenCalledWith(command, args);
    expect(command).toBe('bun');
    expect(args).toEqual(['create', 'stylelint']);
  });

  it('当spawnPromise执行失败时应该抛出错误', async () => {
    const mockError = new Error('命令执行失败');
    utils.spawnPromise.mockRejectedValueOnce(mockError);

    await expect(generateStylelintConfig('npm')).rejects.toThrow(
      '生成 Stylelint 配置文件失败: 命令执行失败'
    );
  });
});
