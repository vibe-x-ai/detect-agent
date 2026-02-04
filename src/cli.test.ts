import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import {
  showHelp,
  showVersion,
  isValidTool,
  formatResult,
  formatAllResults,
  formatJson,
  parseArgs,
  main,
} from './cli.js';
import type { Result } from './types.js';

// Mock console.log and console.error
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

describe('CLI', () => {
  describe('parseArgs', () => {
    it('should parse empty args', () => {
      const result = parseArgs([]);
      expect(result).toEqual({
        tools: [],
        json: false,
        help: false,
        version: false,
      });
    });

    it('should parse --json flag', () => {
      const result = parseArgs(['--json']);
      expect(result.json).toBe(true);
    });

    it('should parse -j flag', () => {
      const result = parseArgs(['-j']);
      expect(result.json).toBe(true);
    });

    it('should parse --help flag', () => {
      const result = parseArgs(['--help']);
      expect(result.help).toBe(true);
    });

    it('should parse -h flag', () => {
      const result = parseArgs(['-h']);
      expect(result.help).toBe(true);
    });

    it('should parse --version flag', () => {
      const result = parseArgs(['--version']);
      expect(result.version).toBe(true);
    });

    it('should parse -v flag', () => {
      const result = parseArgs(['-v']);
      expect(result.version).toBe(true);
    });

    it('should parse tool names', () => {
      const result = parseArgs(['cursor', 'gemini']);
      expect(result.tools).toEqual(['cursor', 'gemini']);
    });

    it('should parse mixed args', () => {
      const result = parseArgs(['cursor', '--json', 'gemini']);
      expect(result.tools).toEqual(['cursor', 'gemini']);
      expect(result.json).toBe(true);
    });
  });

  describe('isValidTool', () => {
    it('should return true for valid tools', () => {
      expect(isValidTool('cursor')).toBe(true);
      expect(isValidTool('claude-code')).toBe(true);
      expect(isValidTool('gemini')).toBe(true);
      expect(isValidTool('codex')).toBe(true);
    });

    it('should return false for invalid tools', () => {
      expect(isValidTool('invalid')).toBe(false);
      expect(isValidTool('')).toBe(false);
      expect(isValidTool('vscode')).toBe(false);
    });
  });

  describe('formatResult', () => {
    it('should format installed tool with version and path', () => {
      const result: Result = {
        name: 'cursor',
        installed: true,
        version: '0.47.0',
        path: '/usr/local/bin/cursor',
      };
      const formatted = formatResult(result);
      expect(formatted).toContain('cursor');
      expect(formatted).toContain('✓');
      expect(formatted).toContain('0.47.0');
      expect(formatted).toContain('/usr/local/bin/cursor');
    });

    it('should format installed tool without version', () => {
      const result: Result = {
        name: 'cursor',
        installed: true,
        path: '/usr/local/bin/cursor',
      };
      const formatted = formatResult(result);
      expect(formatted).toContain('cursor');
      expect(formatted).toContain('✓');
      expect(formatted).toContain('/usr/local/bin/cursor');
    });

    it('should format not installed tool', () => {
      const result: Result = {
        name: 'cursor',
        installed: false,
      };
      const formatted = formatResult(result);
      expect(formatted).toContain('cursor');
      expect(formatted).toContain('✗');
    });
  });

  describe('formatAllResults', () => {
    it('should format multiple results', () => {
      const results: Result[] = [
        { name: 'cursor', installed: true, version: '0.47.0' },
        { name: 'gemini', installed: false },
      ];
      const formatted = formatAllResults(results);
      expect(formatted).toContain('cursor');
      expect(formatted).toContain('gemini');
      expect(formatted.split('\n')).toHaveLength(2);
    });
  });

  describe('formatJson', () => {
    it('should format results as JSON', () => {
      const results: Result[] = [
        { name: 'cursor', installed: true, version: '0.47.0' },
      ];
      const formatted = formatJson(results);
      const parsed = JSON.parse(formatted);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].name).toBe('cursor');
    });
  });

  describe('showHelp', () => {
    it('should output help message', () => {
      showHelp();
      expect(consoleOutput.length).toBeGreaterThan(0);
      const output = consoleOutput.join('\n');
      expect(output).toContain('Usage:');
      expect(output).toContain('detect-agent');
      expect(output).toContain('--help');
      expect(output).toContain('--json');
      expect(output).toContain('cursor');
    });
  });

  describe('showVersion', () => {
    it('should output version', () => {
      showVersion();
      expect(consoleOutput.length).toBe(1);
      // Version should be a valid semver string
      expect(consoleOutput[0]).toMatch(/^\d+\.\d+\.\d+/);
    });
  });

  describe('main', () => {
    it('should show help with --help flag', () => {
      const exitCode = main(['--help']);
      expect(exitCode).toBe(0);
      expect(consoleOutput.join('\n')).toContain('Usage:');
    });

    it('should show help with -h flag', () => {
      const exitCode = main(['-h']);
      expect(exitCode).toBe(0);
      expect(consoleOutput.join('\n')).toContain('Usage:');
    });

    it('should show version with --version flag', () => {
      const exitCode = main(['--version']);
      expect(exitCode).toBe(0);
      expect(consoleOutput[0]).toMatch(/^\d+\.\d+\.\d+/);
    });

    it('should show version with -v flag', () => {
      const exitCode = main(['-v']);
      expect(exitCode).toBe(0);
    });

    it('should detect all tools with no args', () => {
      const exitCode = main([]);
      expect(exitCode).toBe(0);
      const output = consoleOutput.join('\n');
      expect(output).toContain('cursor');
      expect(output).toContain('claude-code');
      expect(output).toContain('gemini');
      expect(output).toContain('codex');
    });

    it('should detect all tools with "all" arg', () => {
      const exitCode = main(['all']);
      expect(exitCode).toBe(0);
      const output = consoleOutput.join('\n');
      expect(output).toContain('cursor');
    });

    it('should detect single tool', () => {
      const exitCode = main(['cursor']);
      expect(exitCode).toBe(0);
      const output = consoleOutput.join('\n');
      expect(output).toContain('cursor');
    });

    it('should detect multiple tools', () => {
      const exitCode = main(['cursor', 'gemini']);
      expect(exitCode).toBe(0);
      const output = consoleOutput.join('\n');
      expect(output).toContain('cursor');
      expect(output).toContain('gemini');
    });

    it('should output JSON with --json flag', () => {
      const exitCode = main(['cursor', '--json']);
      expect(exitCode).toBe(0);
      const output = consoleOutput.join('\n');
      const parsed = JSON.parse(output);
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed[0].name).toBe('cursor');
    });

    it('should return error for invalid tool', () => {
      const exitCode = main(['invalid-tool']);
      expect(exitCode).toBe(1);
      expect(consoleErrors.join('\n')).toContain('Unknown tool');
      expect(consoleErrors.join('\n')).toContain('invalid-tool');
    });

    it('should return error for multiple invalid tools', () => {
      const exitCode = main(['foo', 'bar']);
      expect(exitCode).toBe(1);
      expect(consoleErrors.join('\n')).toContain('foo');
      expect(consoleErrors.join('\n')).toContain('bar');
    });

    it('should show supported tools on error', () => {
      const exitCode = main(['invalid']);
      expect(exitCode).toBe(1);
      expect(consoleErrors.join('\n')).toContain('Supported tools:');
    });
  });
});
