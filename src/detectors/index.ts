import type { Result, ToolName } from '../types.js';
import { SUPPORTED_TOOLS, DetectAgentError } from '../types.js';
import { detectCursor } from './cursor.js';
import { detectClaudeCode } from './claude-code.js';
import { detectGemini } from './gemini.js';
import { detectCodex } from './codex.js';
import { detectWindsurf } from './windsurf.js';
import { detectCopilot } from './copilot.js';
import { detectOpencode } from './opencode.js';
import { detectQoder } from './qoder.js';

const detectorMap: Record<ToolName, () => Result> = {
  'cursor': detectCursor,
  'claude-code': detectClaudeCode,
  'gemini': detectGemini,
  'codex': detectCodex,
  'windsurf': detectWindsurf,
  'copilot': detectCopilot,
  'opencode': detectOpencode,
  'qoder': detectQoder,
};

/**
 * Check if a tool name is valid
 * @param tool The tool name to check
 * @returns true if the tool is supported
 */
export function isValidTool(tool: string): tool is ToolName {
  return SUPPORTED_TOOLS.includes(tool as ToolName);
}

/**
 * Detect a single tool by name
 * @param tool The tool name to detect
 * @returns A Result object
 * @throws DetectAgentError if tool name is invalid
 */
export function detect(tool: ToolName): Result {
  if (!isValidTool(tool)) {
    throw new DetectAgentError(
      tool,
      new Error(`Unknown tool. Supported tools: ${SUPPORTED_TOOLS.join(', ')}`)
    );
  }
  
  const detector = detectorMap[tool];
  return detector();
}

/**
 * Detect multiple tools by names
 * @param tools Array of tool names to detect
 * @returns Array of Result objects
 */
export function detectMultiple(tools: ToolName[]): Result[] {
  return tools.map(tool => detect(tool));
}

/**
 * Detect all supported tools
 * @returns Array of Result objects for all supported tools
 */
export function detectAll(): Result[] {
  const tools = Object.keys(detectorMap) as ToolName[];
  return detectMultiple(tools);
}
