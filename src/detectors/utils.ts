import { execSync } from 'child_process';
import type { Result } from '../types.js';

/**
 * Find the executable path using `which` (macOS/Linux) or `where` (Windows)
 * @param command The command to find
 * @returns The full path to the executable, or null if not found
 */
export function findExecutable(command: string): string | null {
  try {
    const isWindows = process.platform === 'win32';
    const finder = isWindows ? 'where' : 'which';
    const result = execSync(`${finder} ${command}`, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 5000,
    });
    return result.trim() || null;
  } catch {
    return null;
  }
}

/**
 * Get the version of a tool by running `<command> --version`
 * @param command The command to run
 * @returns The version string, or undefined if version couldn't be determined
 */
export function getVersion(command: string): string | undefined {
  try {
    const result = execSync(`${command} --version`, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 5000,
    });
    return result.trim() || undefined;
  } catch {
    return undefined;
  }
}

/**
 * Create a result object for a tool
 * @param name The tool name
 * @param installed Whether the tool is installed
 * @param version The version string if installed
 * @param path The path to the executable if installed
 * @returns A Result object
 */
export function createResult(
  name: string,
  installed: boolean,
  version?: string,
  path?: string
): Result {
  return {
    name,
    installed,
    version,
    path,
  };
}
