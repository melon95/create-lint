import { describe, it, expect, vi, beforeEach } from 'vitest';
import inquirer from 'inquirer';
import { generateEslintConfig } from '../src/generators/eslint.js';
import { generateStylelintConfig } from '../src/generators/stylelint.js';
import { generateCommitlintConfig } from '../src/generators/commitlint.js';
import { generatePrettierConfig } from '../src/generators/prettier.js';
import { generateEditorConfigFile } from '../src/generators/editorconfig.js';
import { setupHusky } from '../src/generators/husky.js';

// Mock all generator functions
vi.mock('../src/generators/eslint.js');
vi.mock('../src/generators/stylelint.js');
vi.mock('../src/generators/commitlint.js');
vi.mock('../src/generators/prettier.js');
vi.mock('../src/generators/editorconfig.js');
vi.mock('../src/generators/husky.js');
vi.mock('chalk', () => ({
  default: {
    blue: vi.fn((text) => text),
    green: vi.fn((text) => text),
    red: vi.fn((text) => text),
  },
}));

describe('lint-master配置工具', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    // Reset modules
    vi.resetModules();
  });

  it('应该使用npm作为包管理器并配置所有工具', async () => {
    // Mock user input
    const mockAnswers = {
      packageManager: 'npm',
      lintTools: [
        'eslint',
        'stylelint',
        'commitlint',
        'prettier',
        'editorconfig',
      ],
      husky: true,
    };

    vi.spyOn(inquirer, 'prompt').mockResolvedValue(mockAnswers);

    // Import and run the main function
    const { init } = await import('../src/index.js');
    await init();

    // Verify that all generator functions were called with correct package manager
    expect(generateEslintConfig).toHaveBeenCalledWith('npm');
    expect(generateStylelintConfig).toHaveBeenCalledWith('npm');
    expect(generateCommitlintConfig).toHaveBeenCalledWith('npm');
    expect(generatePrettierConfig).toHaveBeenCalledWith('npm');
    expect(generateEditorConfigFile).toHaveBeenCalled();
    expect(setupHusky).toHaveBeenCalledWith(
      mockAnswers.lintTools,
      mockAnswers.packageManager
    );
  });

  it('应该使用pnpm作为包管理器并只配置ESLint和Prettier', async () => {
    const mockAnswers = {
      packageManager: 'pnpm',
      lintTools: ['eslint', 'prettier'],
      husky: false,
    };

    vi.spyOn(inquirer, 'prompt').mockResolvedValue(mockAnswers);

    const { init } = await import('../src/index.js');
    await init();

    expect(generateEslintConfig).toHaveBeenCalledWith('pnpm');
    expect(generateStylelintConfig).not.toHaveBeenCalled();
    expect(generateCommitlintConfig).not.toHaveBeenCalled();
    expect(generatePrettierConfig).toHaveBeenCalledWith('pnpm');
    expect(generateEditorConfigFile).not.toHaveBeenCalled();
    expect(setupHusky).not.toHaveBeenCalled();
  });

  it('应该使用yarn作为包管理器并配置部分工具', async () => {
    const mockAnswers = {
      packageManager: 'yarn',
      lintTools: ['eslint', 'stylelint', 'commitlint'],
      husky: true,
    };

    vi.spyOn(inquirer, 'prompt').mockResolvedValue(mockAnswers);

    const { init } = await import('../src/index.js');
    await init();

    expect(generateEslintConfig).toHaveBeenCalledWith('yarn');
    expect(generateStylelintConfig).toHaveBeenCalledWith('yarn');
    expect(generateCommitlintConfig).toHaveBeenCalledWith('yarn');
    expect(generatePrettierConfig).not.toHaveBeenCalled();
    expect(generateEditorConfigFile).not.toHaveBeenCalled();
    expect(setupHusky).toHaveBeenCalledWith(
      mockAnswers.lintTools,
      mockAnswers.packageManager
    );
  });

  it('应该使用bun作为包管理器并配置所有工具', async () => {
    const mockAnswers = {
      packageManager: 'bun',
      lintTools: [
        'eslint',
        'stylelint',
        'commitlint',
        'prettier',
        'editorconfig',
      ],
      husky: true,
    };

    vi.spyOn(inquirer, 'prompt').mockResolvedValue(mockAnswers);

    const { init } = await import('../src/index.js');
    await init();

    expect(generateEslintConfig).toHaveBeenCalledWith('bun');
    expect(generateStylelintConfig).toHaveBeenCalledWith('bun');
    expect(generateCommitlintConfig).toHaveBeenCalledWith('bun');
    expect(generatePrettierConfig).toHaveBeenCalledWith('bun');
    expect(generateEditorConfigFile).toHaveBeenCalled();
    expect(setupHusky).toHaveBeenCalledWith(
      mockAnswers.lintTools,
      mockAnswers.packageManager
    );
  });

  it('应该在生成器函数抛出错误时正确处理错误', async () => {
    const mockAnswers = {
      packageManager: 'yarn',
      lintTools: ['eslint'],
      husky: false,
    };

    vi.spyOn(inquirer, 'prompt').mockResolvedValue(mockAnswers);
    vi.spyOn(process, 'exit').mockImplementation(() => {});

    // Mock ESLint generator to throw an error
    generateEslintConfig.mockRejectedValue(new Error('ESLint配置失败'));

    const { init } = await import('../src/index.js');
    await init();

    expect(process.exit).toHaveBeenCalledWith(1);
  });

  it('应该在用户取消操作时正确处理', async () => {
    vi.spyOn(inquirer, 'prompt').mockRejectedValue(new Error('用户取消'));
    vi.spyOn(process, 'exit').mockImplementation(() => {});

    const { init } = await import('../src/index.js');
    await init();

    expect(process.exit).toHaveBeenCalledWith(1);
  });
});
