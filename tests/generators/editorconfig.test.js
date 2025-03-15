import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateEditorConfigFile } from '../../src/generators/editorconfig.js';
import { writeFile } from 'fs/promises';

// Mock fs/promises
vi.mock('fs/promises', () => ({
  writeFile: vi.fn().mockResolvedValue(undefined),
}));

describe('generateEditorConfigFile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('应该正确生成.editorconfig文件', async () => {
    await generateEditorConfigFile();

    expect(writeFile).toHaveBeenCalledTimes(1);
    expect(writeFile).toHaveBeenCalledWith(
      '.editorconfig',
      expect.stringContaining('root = true')
    );
  });

  it('当写入文件失败时应该抛出错误', async () => {
    const mockError = new Error('写入文件失败');
    vi.mocked(writeFile).mockRejectedValueOnce(mockError);

    await expect(generateEditorConfigFile()).rejects.toThrow(
      'EditorConfig配置生成失败'
    );
  });
});
