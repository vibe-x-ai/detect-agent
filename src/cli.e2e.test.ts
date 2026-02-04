/**
 * CLI End-to-End tests - 测试 CLI 功能
 * 通过直接调用 main 函数并捕获输出来测试
 */
import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { main } from './cli.js';

// 捕获 console 输出
let consoleOutput: string[] = [];
let consoleErrors: string[] = [];
const originalLog = console.log;
const originalError = console.error;

beforeEach(() => {
  consoleOutput = [];
  consoleErrors = [];
  console.log = jest.fn((...args: unknown[]) => {
    consoleOutput.push(args.map(String).join(' '));
  }) as typeof console.log;
  console.error = jest.fn((...args: unknown[]) => {
    consoleErrors.push(args.map(String).join(' '));
  }) as typeof console.error;
});

afterEach(() => {
  console.log = originalLog;
  console.error = originalError;
});

/**
 * 运行 CLI 并获取结果
 */
function runCli(args: string[] = []): { stdout: string; stderr: string; exitCode: number } {
  const exitCode = main(args);
  return {
    stdout: consoleOutput.join('\n'),
    stderr: consoleErrors.join('\n'),
    exitCode,
  };
}

describe('CLI E2E Tests', () => {
  describe('--help', () => {
    it('should show help message with --help', () => {
      const { stdout, exitCode } = runCli(['--help']);
      
      expect(exitCode).toBe(0);
      expect(stdout).toContain('Usage:');
      expect(stdout).toContain('detect-agent');
      expect(stdout).toContain('--json');
      expect(stdout).toContain('--help');
      expect(stdout).toContain('--version');
    });

    it('should show help message with -h', () => {
      const { stdout, exitCode } = runCli(['-h']);
      
      expect(exitCode).toBe(0);
      expect(stdout).toContain('Usage:');
    });

    it('should list all supported tools in help', () => {
      const { stdout } = runCli(['--help']);
      
      expect(stdout).toContain('cursor');
      expect(stdout).toContain('claude-code');
      expect(stdout).toContain('gemini');
      expect(stdout).toContain('codex');
    });
  });

  describe('--version', () => {
    it('should show version with --version', () => {
      const { stdout, exitCode } = runCli(['--version']);
      
      expect(exitCode).toBe(0);
      // 版本号格式：x.y.z
      expect(stdout).toMatch(/^\d+\.\d+\.\d+$/);
    });

    it('should show version with -v', () => {
      const { stdout, exitCode } = runCli(['-v']);
      
      expect(exitCode).toBe(0);
      expect(stdout).toMatch(/^\d+\.\d+\.\d+$/);
    });
  });

  describe('detect all', () => {
    it('should detect all tools with no args', () => {
      const { stdout, exitCode } = runCli([]);
      
      expect(exitCode).toBe(0);
      expect(stdout).toContain('cursor');
      expect(stdout).toContain('claude-code');
      expect(stdout).toContain('gemini');
      expect(stdout).toContain('codex');
    });

    it('should detect all tools with "all" arg', () => {
      const { stdout, exitCode } = runCli(['all']);
      
      expect(exitCode).toBe(0);
      expect(stdout).toContain('cursor');
    });

    it('should show installation status', () => {
      const { stdout } = runCli([]);
      
      // 输出应该包含每个工具的安装状态
      // 新格式使用 ✓/✗ 图标
      expect(stdout).toMatch(/[✓✗]\s+cursor/);
      expect(stdout).toMatch(/[✓✗]\s+claude-code/);
      expect(stdout).toMatch(/[✓✗]\s+gemini/);
      expect(stdout).toMatch(/[✓✗]\s+codex/);
    });
  });

  describe('detect single tool', () => {
    it('should detect cursor', () => {
      const { stdout, exitCode } = runCli(['cursor']);
      
      expect(exitCode).toBe(0);
      expect(stdout).toContain('cursor');
      expect(stdout).toMatch(/[✓✗]\s+cursor/);
    });

    it('should detect claude-code', () => {
      const { stdout, exitCode } = runCli(['claude-code']);
      
      expect(exitCode).toBe(0);
      expect(stdout).toContain('claude-code');
    });

    it('should detect gemini', () => {
      const { stdout, exitCode } = runCli(['gemini']);
      
      expect(exitCode).toBe(0);
      expect(stdout).toContain('gemini');
    });

    it('should detect codex', () => {
      const { stdout, exitCode } = runCli(['codex']);
      
      expect(exitCode).toBe(0);
      expect(stdout).toContain('codex');
    });
  });

  describe('detect multiple tools', () => {
    it('should detect two tools', () => {
      const { stdout, exitCode } = runCli(['cursor', 'gemini']);
      
      expect(exitCode).toBe(0);
      expect(stdout).toContain('cursor');
      expect(stdout).toContain('gemini');
      // 不应该包含其他工具
      expect(stdout).not.toContain('claude-code');
      expect(stdout).not.toContain('codex');
    });

    it('should detect three tools', () => {
      const { stdout, exitCode } = runCli(['cursor', 'gemini', 'codex']);
      
      expect(exitCode).toBe(0);
      // 验证包含所有请求的工具（注意：version 可能包含多行）
      expect(stdout).toContain('cursor');
      expect(stdout).toContain('gemini');
      expect(stdout).toContain('codex');
      // 不应该包含未请求的工具
      expect(stdout).not.toContain('claude-code');
    });
  });

  describe('--json output', () => {
    it('should output valid JSON with --json', () => {
      const { stdout, exitCode } = runCli(['--json']);
      
      expect(exitCode).toBe(0);
      
      const parsed = JSON.parse(stdout);
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed.length).toBe(8);
    });

    it('should output valid JSON with -j', () => {
      const { stdout, exitCode } = runCli(['-j']);
      
      expect(exitCode).toBe(0);
      expect(() => JSON.parse(stdout)).not.toThrow();
    });

    it('should include all required fields in JSON', () => {
      const { stdout } = runCli(['--json']);
      const parsed = JSON.parse(stdout);
      
      for (const result of parsed) {
        expect(result).toHaveProperty('name');
        expect(result).toHaveProperty('installed');
        expect(typeof result.name).toBe('string');
        expect(typeof result.installed).toBe('boolean');
      }
    });

    it('should work with single tool and --json', () => {
      const { stdout, exitCode } = runCli(['cursor', '--json']);
      
      expect(exitCode).toBe(0);
      
      const parsed = JSON.parse(stdout);
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].name).toBe('cursor');
    });

    it('should work with multiple tools and --json', () => {
      const { stdout, exitCode } = runCli(['cursor', 'gemini', '--json']);
      
      expect(exitCode).toBe(0);
      
      const parsed = JSON.parse(stdout);
      expect(parsed).toHaveLength(2);
      expect(parsed[0].name).toBe('cursor');
      expect(parsed[1].name).toBe('gemini');
    });
  });

  describe('error handling', () => {
    it('should return error for invalid tool', () => {
      const { stderr, exitCode } = runCli(['invalid-tool']);
      
      expect(exitCode).toBe(1);
      expect(stderr).toContain('Unknown tool');
      expect(stderr).toContain('invalid-tool');
    });

    it('should return error for multiple invalid tools', () => {
      const { stderr, exitCode } = runCli(['foo', 'bar']);
      
      expect(exitCode).toBe(1);
      expect(stderr).toContain('foo');
      expect(stderr).toContain('bar');
    });

    it('should show supported tools on error', () => {
      const { stderr, exitCode } = runCli(['invalid']);
      
      expect(exitCode).toBe(1);
      expect(stderr).toContain('Supported tools');
      expect(stderr).toContain('cursor');
    });

    it('should handle mix of valid and invalid tools', () => {
      const { stderr, exitCode } = runCli(['cursor', 'invalid']);
      
      expect(exitCode).toBe(1);
      expect(stderr).toContain('invalid');
    });
  });

  describe('flag combinations', () => {
    it('should prioritize --help over other flags', () => {
      const { stdout, exitCode } = runCli(['--help', '--json']);
      
      expect(exitCode).toBe(0);
      expect(stdout).toContain('Usage:');
    });

    it('should prioritize --version over tool detection', () => {
      const { stdout, exitCode } = runCli(['--version', 'cursor']);
      
      expect(exitCode).toBe(0);
      expect(stdout).toMatch(/^\d+\.\d+\.\d+$/);
    });

    it('should work with --json at different positions', () => {
      // 重置 console 捕获
      consoleOutput = [];
      const result1 = runCli(['--json', 'cursor']);
      const stdout1 = result1.stdout;
      
      consoleOutput = [];
      const result2 = runCli(['cursor', '--json']);
      const stdout2 = result2.stdout;
      
      expect(result1.exitCode).toBe(0);
      expect(result2.exitCode).toBe(0);
      
      // 两种方式应该产生相同的 JSON 结构
      const parsed1 = JSON.parse(stdout1);
      const parsed2 = JSON.parse(stdout2);
      
      expect(parsed1[0].name).toBe(parsed2[0].name);
    });
  });
});
