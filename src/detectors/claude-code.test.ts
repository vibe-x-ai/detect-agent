/**
 * Claude Code detector unit tests
 */
import { describe, it, expect } from '@jest/globals';
import { detectClaudeCode } from './claude-code.js';

describe('detectClaudeCode', () => {
  it('should return Result with correct name', () => {
    const result = detectClaudeCode();
    expect(result.name).toBe('claude-code');
  });

  it('should return Result with installed boolean', () => {
    const result = detectClaudeCode();
    expect(typeof result.installed).toBe('boolean');
  });

  it('should have version when installed', () => {
    const result = detectClaudeCode();
    if (result.installed) {
      if (result.version !== undefined) {
        expect(typeof result.version).toBe('string');
        expect(result.version.length).toBeGreaterThan(0);
      }
    }
  });

  it('should have path when installed', () => {
    const result = detectClaudeCode();
    if (result.installed) {
      expect(result.path).toBeDefined();
      expect(typeof result.path).toBe('string');
      expect(result.path!.length).toBeGreaterThan(0);
    }
  });

  it('should not have version and path when not installed', () => {
    const result = detectClaudeCode();
    if (!result.installed) {
      expect(result.version).toBeUndefined();
      expect(result.path).toBeUndefined();
    }
  });

  it('should return consistent results', () => {
    const result1 = detectClaudeCode();
    const result2 = detectClaudeCode();
    
    expect(result1.name).toBe(result2.name);
    expect(result1.installed).toBe(result2.installed);
  });
});
