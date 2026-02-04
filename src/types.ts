/**
 * Result of detecting an AI agent tool
 */
export interface Result {
  /** Tool name identifier (e.g., 'cursor', 'claude-code', 'gemini', 'codex') */
  name: string;
  /** Whether the tool is installed on the system */
  installed: boolean;
  /** Version string if installed, undefined if not installed */
  version?: string;
  /** Path to the executable if installed, undefined if not installed */
  path?: string;
}

/**
 * Custom error class for detection errors
 */
export class DetectAgentError extends Error {
  /** The tool that caused the error */
  tool: string;
  /** The underlying error that caused this error */
  cause: Error;

  constructor(tool: string, cause: Error) {
    super(`Failed to detect ${tool}: ${cause.message}`);
    this.name = 'DetectAgentError';
    this.tool = tool;
    this.cause = cause;
  }
}

/**
 * Supported tool identifiers
 */
export type ToolName = 'cursor' | 'claude-code' | 'gemini' | 'codex' | 'windsurf' | 'copilot' | 'opencode' | 'qoder';

/**
 * List of all supported tool names
 */
export const SUPPORTED_TOOLS: ToolName[] = [
  'cursor',
  'claude-code',
  'gemini',
  'codex',
  'windsurf',
  'copilot',
  'opencode',
  'qoder',
];
