import { describe, it, expect, vi, beforeEach } from 'vitest';
import { spawn } from 'child_process';
import { spawnPromise, getPackageJson, setPackageJson } from '../src/utils.js';
import { readFile, writeFile } from 'fs/promises';

// Mock child_process
vi.mock('child_process', () => ({
  spawn: vi.fn(),
}));

// Mock fs/promises
vi.mock('fs/promises', () => ({
  readFile: vi.fn(),
  writeFile: vi.fn(),
}));

describe('spawnPromise', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('应该在命令成功执行时正常解析', async () => {
    const mockProcess = {
      on: vi.fn(),
    };

    spawn.mockReturnValue(mockProcess);

    const promise = spawnPromise('test-command', ['arg1', 'arg2']);

    // 模拟成功的 close 事件
    const closeCallback = mockProcess.on.mock.calls.find(
      (call) => call[0] === 'close'
    )[1];
    closeCallback(0);

    await expect(promise).resolves.toBeUndefined();
    expect(spawn).toHaveBeenCalledWith('test-command', ['arg1', 'arg2'], {
      stdio: 'inherit',
      shell: true,
    });
  });

  it('应该在命令执行失败时抛出错误', async () => {
    const mockProcess = {
      on: vi.fn(),
    };

    spawn.mockReturnValue(mockProcess);

    const promise = spawnPromise('test-command', ['arg1']);

    // 模拟失败的 close 事件
    const closeCallback = mockProcess.on.mock.calls.find(
      (call) => call[0] === 'close'
    )[1];
    closeCallback(1);

    await expect(promise).rejects.toThrow(
      'Stylelint 配置初始化失败，退出码: 1'
    );
  });

  it('应该在命令出错时抛出错误', async () => {
    const mockProcess = {
      on: vi.fn(),
    };

    spawn.mockReturnValue(mockProcess);

    const promise = spawnPromise('test-command', ['arg1']);

    // 模拟 error 事件
    const errorCallback = mockProcess.on.mock.calls.find(
      (call) => call[0] === 'error'
    )[1];
    errorCallback(new Error('命令执行失败'));

    await expect(promise).rejects.toThrow(
      'Stylelint 配置初始化失败: 命令执行失败'
    );
  });
});

describe('getPackageJson', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('应该正确读取并解析 package.json 文件', async () => {
    const mockPackageJson = { name: 'test-package', version: '1.0.0' };
    readFile.mockResolvedValue(JSON.stringify(mockPackageJson));

    const result = await getPackageJson();

    expect(result).toEqual(mockPackageJson);
    expect(readFile).toHaveBeenCalledWith('./package.json', 'utf-8');
  });

  it('应该在读取文件失败时抛出错误', async () => {
    readFile.mockRejectedValue(new Error('文件不存在'));

    await expect(getPackageJson()).rejects.toThrow(
      '读取 package.json 文件失败: 文件不存在'
    );
  });
});

describe('setPackageJson', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('应该正确写入 package.json 文件', async () => {
    const mockPackageJson = { name: 'test-package', version: '1.0.0' };

    await setPackageJson(mockPackageJson);

    expect(writeFile).toHaveBeenCalledWith(
      './package.json',
      JSON.stringify(mockPackageJson, null, 2)
    );
  });

  it('应该在写入文件失败时抛出错误', async () => {
    const mockPackageJson = { name: 'test-package' };
    writeFile.mockRejectedValue(new Error('写入失败'));

    await expect(setPackageJson(mockPackageJson)).rejects.toThrow(
      '写入 package.json 文件失败: 写入失败'
    );
  });
});
