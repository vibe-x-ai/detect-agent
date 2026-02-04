/**
 * Cursor detector unit tests
 */
import { describe, it, expect } from '@jest/globals';
import { detectCursor } from './cursor.js';

describe('detectCursor', () => {
  it('should return Result with correct name', () => {
    const result = detectCursor();
    expect(result.name).toBe('cursor');
  });

  it('should return Result with installed boolean', () => {
    const result = detectCursor();
    expect(typeof result.installed).toBe('boolean');
  });

  it('should have version when installed', () => {
    const result = detectCursor();
    if (result.installed) {
      // version 可能为 undefined（如果 --version 失败）
      if (result.version !== undefined) {
        expect(typeof result.version).toBe('string');
        expect(result.version.length).toBeGreaterThan(0);
      }
    }
  });

  it('should have path when installed', () => {
    const result = detectCursor();
    if (result.installed) {
      expect(result.path).toBeDefined();
      expect(typeof result.path).toBe('string');
      expect(result.path!.length).toBeGreaterThan(0);
    }
  });

  it('should not have version and path when not installed', () => {
    const result = detectCursor();
    if (!result.installed) {
      expect(result.version).toBeUndefined();
      expect(result.path).toBeUndefined();
    }
  });

  it('should return consistent results', () => {
    const result1 = detectCursor();
    const result2 = detectCursor();
    
    expect(result1.name).toBe(result2.name);
    expect(result1.installed).toBe(result2.installed);
  });
});
