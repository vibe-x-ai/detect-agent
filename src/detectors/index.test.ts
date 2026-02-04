import { detect, detectMultiple, detectAll } from './index.js';

describe('detectors/index', () => {
  describe('detect', () => {
    it('should return a Result object for cursor', () => {
      const result = detect('cursor');
      expect(result).toHaveProperty('name', 'cursor');
      expect(result).toHaveProperty('installed');
    });

    it('should return a Result object for claude-code', () => {
      const result = detect('claude-code');
      expect(result).toHaveProperty('name', 'claude-code');
      expect(result).toHaveProperty('installed');
    });

    it('should return a Result object for gemini', () => {
      const result = detect('gemini');
      expect(result).toHaveProperty('name', 'gemini');
      expect(result).toHaveProperty('installed');
    });

    it('should return a Result object for codex', () => {
      const result = detect('codex');
      expect(result).toHaveProperty('name', 'codex');
      expect(result).toHaveProperty('installed');
    });
  });

  describe('detectMultiple', () => {
    it('should return an array of Result objects', () => {
      const results = detectMultiple(['cursor', 'claude-code']);
      expect(results).toHaveLength(2);
      expect(results[0].name).toBe('cursor');
      expect(results[1].name).toBe('claude-code');
    });

    it('should handle empty array', () => {
      const results = detectMultiple([]);
      expect(results).toHaveLength(0);
    });
  });

  describe('detectAll', () => {
    it('should return results for all supported tools', () => {
      const results = detectAll();
      expect(results).toHaveLength(8);

      const names = results.map(r => r.name);
      expect(names).toContain('cursor');
      expect(names).toContain('claude-code');
      expect(names).toContain('gemini');
      expect(names).toContain('codex');
      expect(names).toContain('windsurf');
      expect(names).toContain('copilot');
      expect(names).toContain('opencode');
      expect(names).toContain('qoder');
    });
  });
});
