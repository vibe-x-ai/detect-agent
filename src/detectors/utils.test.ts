import { createResult } from './utils.js';

describe('utils', () => {
  describe('createResult', () => {
    it('should create a result for installed tool', () => {
      const result = createResult('cursor', true, '0.47.0', '/usr/local/bin/cursor');
      expect(result.name).toBe('cursor');
      expect(result.installed).toBe(true);
      expect(result.version).toBe('0.47.0');
      expect(result.path).toBe('/usr/local/bin/cursor');
    });

    it('should create a result for not installed tool', () => {
      const result = createResult('claude-code', false);
      expect(result.name).toBe('claude-code');
      expect(result.installed).toBe(false);
      expect(result.version).toBeUndefined();
      expect(result.path).toBeUndefined();
    });

    it('should create a result with only name and installed status', () => {
      const result = createResult('gemini', true);
      expect(result.name).toBe('gemini');
      expect(result.installed).toBe(true);
      expect(result.version).toBeUndefined();
      expect(result.path).toBeUndefined();
    });
  });
});
