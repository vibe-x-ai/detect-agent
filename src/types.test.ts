import { Result, DetectAgentError } from './types.js';

describe('types', () => {
  describe('Result interface', () => {
    it('should have name and installed properties', () => {
      const result: Result = {
        name: 'cursor',
        installed: true,
      };
      expect(result.name).toBe('cursor');
      expect(result.installed).toBe(true);
    });

    it('should allow optional version and path', () => {
      const result: Result = {
        name: 'cursor',
        installed: true,
        version: '0.47.0',
        path: '/usr/local/bin/cursor',
      };
      expect(result.version).toBe('0.47.0');
      expect(result.path).toBe('/usr/local/bin/cursor');
    });

    it('should allow installed false without version and path', () => {
      const result: Result = {
        name: 'cursor',
        installed: false,
      };
      expect(result.version).toBeUndefined();
      expect(result.path).toBeUndefined();
    });
  });

  describe('DetectAgentError class', () => {
    it('should have tool and cause properties', () => {
      const cause = new Error('test error');
      const error = new DetectAgentError('cursor', cause);
      expect(error.tool).toBe('cursor');
      expect(error.cause).toBe(cause);
    });

    it('should have correct message', () => {
      const cause = new Error('test error');
      const error = new DetectAgentError('cursor', cause);
      expect(error.message).toBe('Failed to detect cursor: test error');
    });

    it('should have correct name', () => {
      const error = new DetectAgentError('cursor', new Error('test'));
      expect(error.name).toBe('DetectAgentError');
    });
  });
});
