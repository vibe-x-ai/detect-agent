import type { Result } from '../types.js';
import { findExecutable, getVersion, createResult } from './utils.js';

const TOOL_NAME = 'claude-code';
const COMMAND = 'claude-code';

/**
 * Detect if Claude Code is installed on the system
 * @returns A Result object indicating installation status and version
 */
export function detectClaudeCode(): Result {
  try {
    const path = findExecutable(COMMAND);

    if (!path) {
      return createResult(TOOL_NAME, false);
    }

    const version = getVersion(COMMAND);

    return createResult(TOOL_NAME, true, version, path);
  } catch {
    // If any unexpected error occurs, return not installed
    return createResult(TOOL_NAME, false);
  }
}
