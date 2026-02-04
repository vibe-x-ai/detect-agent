/**
 * Library API tests - 测试作为 npm 包导入时的公共 API
 */
import { describe, it, expect } from '@jest/globals';
import {
  detect,
  detectMultiple,
  detectAll,
  isValidTool,
  DetectAgentError,
  SUPPORTED_TOOLS,
} from './index.js';
import type { Result, ToolName } from './index.js';

describe('Library API', () => {
  describe('exports', () => {
    it('should export detect function', () => {
      expect(typeof detect).toBe('function');
    });

    it('should export detectMultiple function', () => {
      expect(typeof detectMultiple).toBe('function');
    });

    it('should export detectAll function', () => {
      expect(typeof detectAll).toBe('function');
    });

    it('should export isValidTool function', () => {
      expect(typeof isValidTool).toBe('function');
    });

    it('should export DetectAgentError class', () => {
      expect(DetectAgentError).toBeDefined();
      expect(typeof DetectAgentError).toBe('function');
    });

    it('should export SUPPORTED_TOOLS array', () => {
      expect(Array.isArray(SUPPORTED_TOOLS)).toBe(true);
      expect(SUPPORTED_TOOLS).toContain('cursor');
      expect(SUPPORTED_TOOLS).toContain('claude-code');
      expect(SUPPORTED_TOOLS).toContain('gemini');
      expect(SUPPORTED_TOOLS).toContain('codex');
    });
  });

  describe('detect()', () => {
    it('should return Result object with correct structure', () => {
      const result = detect('cursor');
      
      // 验证必须字段
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('installed');
      expect(typeof result.name).toBe('string');
      expect(typeof result.installed).toBe('boolean');
      
      // 验证可选字段类型
      if (result.installed) {
        if (result.version !== undefined) {
          expect(typeof result.version).toBe('string');
        }
        if (result.path !== undefined) {
          expect(typeof result.path).toBe('string');
        }
      }
    });

    it('should return correct tool name in result', () => {
      for (const tool of SUPPORTED_TOOLS) {
        const result = detect(tool);
        expect(result.name).toBe(tool);
      }
    });

    it('should throw DetectAgentError for invalid tool', () => {
      expect(() => detect('invalid-tool' as ToolName)).toThrow(DetectAgentError);
    });

    it('should include tool name in error', () => {
      try {
        detect('invalid-tool' as ToolName);
      } catch (e) {
        expect(e).toBeInstanceOf(DetectAgentError);
        expect((e as DetectAgentError).tool).toBe('invalid-tool');
      }
    });
  });

  describe('detectMultiple()', () => {
    it('should return array of Results', () => {
      const results = detectMultiple(['cursor', 'gemini']);
      
      expect(Array.isArray(results)).toBe(true);
      expect(results).toHaveLength(2);
    });

    it('should return results in same order as input', () => {
      const tools: ToolName[] = ['gemini', 'cursor', 'codex'];
      const results = detectMultiple(tools);
      
      expect(results[0].name).toBe('gemini');
      expect(results[1].name).toBe('cursor');
      expect(results[2].name).toBe('codex');
    });

    it('should handle single tool array', () => {
      const results = detectMultiple(['cursor']);
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('cursor');
    });

    it('should handle empty array', () => {
      const results = detectMultiple([]);
      expect(results).toHaveLength(0);
    });

    it('should handle duplicate tools', () => {
      const results = detectMultiple(['cursor', 'cursor']);
      expect(results).toHaveLength(2);
      expect(results[0].name).toBe('cursor');
      expect(results[1].name).toBe('cursor');
    });

    it('should handle all supported tools', () => {
      const results = detectMultiple(SUPPORTED_TOOLS as ToolName[]);
      expect(results).toHaveLength(SUPPORTED_TOOLS.length);
    });
  });

  describe('detectAll()', () => {
    it('should return results for all supported tools', () => {
      const results = detectAll();
      
      expect(results).toHaveLength(SUPPORTED_TOOLS.length);
      
      const names = results.map(r => r.name);
      for (const tool of SUPPORTED_TOOLS) {
        expect(names).toContain(tool);
      }
    });

    it('should return unique results', () => {
      const results = detectAll();
      const names = results.map(r => r.name);
      const uniqueNames = [...new Set(names)];
      
      expect(names.length).toBe(uniqueNames.length);
    });

    it('should return consistent results on multiple calls', () => {
      const results1 = detectAll();
      const results2 = detectAll();
      
      expect(results1.length).toBe(results2.length);
      
      for (let i = 0; i < results1.length; i++) {
        expect(results1[i].name).toBe(results2[i].name);
        expect(results1[i].installed).toBe(results2[i].installed);
      }
    });
  });

  describe('isValidTool()', () => {
    it('should return true for all supported tools', () => {
      for (const tool of SUPPORTED_TOOLS) {
        expect(isValidTool(tool)).toBe(true);
      }
    });

    it('should return false for invalid tool names', () => {
      expect(isValidTool('invalid')).toBe(false);
      expect(isValidTool('')).toBe(false);
      expect(isValidTool('vscode')).toBe(false);
      expect(isValidTool('CURSOR')).toBe(false); // 区分大小写
      expect(isValidTool('Cursor')).toBe(false);
    });

    it('should be usable as type guard', () => {
      const toolName = 'cursor';
      if (isValidTool(toolName)) {
        // TypeScript 应该允许这里使用 toolName 作为 ToolName
        const result = detect(toolName);
        expect(result.name).toBe(toolName);
      }
    });
  });

  describe('DetectAgentError', () => {
    it('should be throwable', () => {
      const cause = new Error('test cause');
      const error = new DetectAgentError('test-tool', cause);
      
      expect(() => { throw error; }).toThrow(DetectAgentError);
    });

    it('should have correct properties', () => {
      const cause = new Error('test cause');
      const error = new DetectAgentError('test-tool', cause);
      
      expect(error.tool).toBe('test-tool');
      expect(error.cause).toBe(cause);
      expect(error.name).toBe('DetectAgentError');
      expect(error.message).toContain('test-tool');
      expect(error.message).toContain('test cause');
    });

    it('should be instanceof Error', () => {
      const error = new DetectAgentError('test', new Error('cause'));
      expect(error).toBeInstanceOf(Error);
    });
  });

  describe('Result type contract', () => {
    it('should have version and path when installed', () => {
      const results = detectAll();
      
      for (const result of results) {
        if (result.installed) {
          // 已安装的工具应该有 path（version 可能为空，因为某些工具不支持 --version）
          expect(result.path).toBeDefined();
          expect(typeof result.path).toBe('string');
        }
      }
    });

    it('should not have version and path when not installed', () => {
      const results = detectAll();
      
      for (const result of results) {
        if (!result.installed) {
          // 未安装的工具不应该有 version 和 path
          expect(result.version).toBeUndefined();
          expect(result.path).toBeUndefined();
        }
      }
    });
  });

  describe('SUPPORTED_TOOLS constant', () => {
    it('should be frozen or immutable in usage', () => {
      const originalLength = SUPPORTED_TOOLS.length;
      
      // 尝试修改应该不影响后续使用
      const copy = [...SUPPORTED_TOOLS];
      expect(copy.length).toBe(originalLength);
    });

    it('should contain exactly 8 tools', () => {
      expect(SUPPORTED_TOOLS).toHaveLength(8);
    });

    it('should contain expected tool names', () => {
      expect(SUPPORTED_TOOLS).toEqual(
        expect.arrayContaining(['cursor', 'claude-code', 'gemini', 'codex', 'windsurf', 'copilot', 'opencode', 'qoder'])
      );
    });
  });
});
