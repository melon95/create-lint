import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  generateEslintConfig,
  buildEslintCommand,
} from '../../src/generators/eslint.js';
import * as utils from '../../src/utils.js';

// Mock utils
vi.mock('../../src/utils.js', () => ({
  spawnPromise: vi.fn().mockResolvedValue(undefined),
  getPackageJson: vi.fn().mockResolvedValue({ scripts: {} }),
  setPackageJson: vi.fn().mockResolvedValue(undefined),
}));

describe('generateEslintConfig', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('应该使用npm正确构建命令并调用spawnPromise', async () => {
    await generateEslintConfig('npm');

    const { command, args } = buildEslintCommand('npm');
    expect(utils.spawnPromise).toHaveBeenCalledWith(command, args);
    expect(command).toBe('npm');
    expect(args).toEqual(['init', '@eslint/config']);
  });

  it('应该使用yarn正确构建命令并调用spawnPromise', async () => {
    await generateEslintConfig('yarn');

    const { command, args } = buildEslintCommand('yarn');
    expect(utils.spawnPromise).toHaveBeenCalledWith(command, args);
    expect(command).toBe('yarn');
    expect(args).toEqual(['create', '@eslint/config']);
  });

  it('应该使用pnpm正确构建命令并调用spawnPromise', async () => {
    await generateEslintConfig('pnpm');

    const { command, args } = buildEslintCommand('pnpm');
    expect(utils.spawnPromise).toHaveBeenCalledWith(command, args);
    expect(command).toBe('pnpm');
    expect(args).toEqual(['create', '@eslint/config']);
  });

  it('应该使用bun正确构建命令并调用spawnPromise', async () => {
    await generateEslintConfig('bun');

    const { command, args } = buildEslintCommand('bun');
    expect(utils.spawnPromise).toHaveBeenCalledWith(command, args);
    expect(command).toBe('bun');
    expect(args).toEqual(['create', '@eslint/config']);
  });

  it('当spawnPromise执行失败时应该抛出错误', async () => {
    const mockError = new Error('命令执行失败');
    utils.spawnPromise.mockRejectedValueOnce(mockError);

    await expect(generateEslintConfig('npm')).rejects.toThrow(
      '生成 ESLint 配置文件失败: 命令执行失败'
    );
  });

  it('应该正确更新package.json中的lint脚本', async () => {
    await generateEslintConfig('npm');

    expect(utils.getPackageJson).toHaveBeenCalled();
    expect(utils.setPackageJson).toHaveBeenCalledWith({
      scripts: {
        lint: 'eslint --fix',
      },
    });
  });
});
