#!/usr/bin/env node

import { createRequire } from 'module';
import pc from 'picocolors';
import type { Result, ToolName } from './types.js';
import { SUPPORTED_TOOLS } from './types.js';
import { detect, detectMultiple, detectAll } from './detectors/index.js';

const require = createRequire(import.meta.url);
const pkg = require('../package.json') as { version: string; name: string };

const MAX_TOOL_NAME_LENGTH = 12;

/**
 * 8-bit pixel style ASCII art banner
 */
const BANNER = `
${pc.cyan('█▀▀▄ █▀▀ ▀▀█▀▀ █▀▀ █▀▀ ▀▀█▀▀')} ${pc.dim('░░')} ${pc.magenta('█▀▀█ █▀▀▀ █▀▀ █▀▀▄ ▀▀█▀▀')}
${pc.cyan('█░░█ █▀▀ ░░█░░ █▀▀ █░░ ░░█░░')} ${pc.dim('▀▀')} ${pc.magenta('█▄▄█ █░▀█ █▀▀ █░░█ ░░█░░')}
${pc.cyan('▀▀▀░ ▀▀▀ ░░▀░░ ▀▀▀ ▀▀▀ ░░▀░░')} ${pc.dim('░░')} ${pc.magenta('▀░░▀ ▀▀▀▀ ▀▀▀ ▀░░▀ ░░▀░░')}
`;

/**
 * Show help message
 */
export function showHelp(): void {
  console.log(BANNER);
  console.log(`${pc.bold('Usage:')} detect-agent [tools...] [options]

${pc.bold('Description:')}
  Detect AI agent tools installed on your system.

${pc.bold('Tools:')}
  ${SUPPORTED_TOOLS.join(', ')}, all

${pc.bold('Options:')}
  ${pc.yellow('--json, -j')}     Output JSON format
  ${pc.yellow('--help, -h')}     Show this help message
  ${pc.yellow('--version, -v')}  Show version number

${pc.bold('Examples:')}
  ${pc.dim('$')} detect-agent                  ${pc.dim('# Detect all supported tools')}
  ${pc.dim('$')} detect-agent cursor           ${pc.dim('# Detect only Cursor')}
  ${pc.dim('$')} detect-agent cursor gemini    ${pc.dim('# Detect Cursor and Gemini')}
  ${pc.dim('$')} detect-agent all --json       ${pc.dim('# Detect all tools, output as JSON')}
`);
}

/**
 * Show version
 */
export function showVersion(): void {
  console.log(pkg.version);
}

/**
 * Check if a tool name is valid
 * @param tool The tool name to check
 * @returns true if valid
 */
export function isValidTool(tool: string): tool is ToolName {
  return SUPPORTED_TOOLS.includes(tool as ToolName);
}

/**
 * Format a single result for text output
 * @param result The detection result
 * @returns Formatted string
 */
export function formatResult(result: Result): string {
  const { name, installed, version, path } = result;
  const paddedName = name.padEnd(MAX_TOOL_NAME_LENGTH);

  if (installed) {
    // Extract only the first line of version (remove commit hash, arch info)
    const cleanVersion = version?.split('\n')[0]?.trim();
    const symbol = pc.green('✓');
    const toolName = pc.green(paddedName);
    const versionStr = cleanVersion ? pc.cyan(cleanVersion.padEnd(16)) : pc.dim('-'.padEnd(16));
    const pathStr = path ? pc.dim(path) : '';
    return `${symbol} ${toolName} ${versionStr} ${pathStr}`;
  } else {
    const symbol = pc.dim('✗');
    const toolName = pc.dim(paddedName);
    return `${symbol} ${toolName} ${pc.dim('-')}`;
  }
}

/**
 * Format all results for text output
 * @param results Array of detection results
 * @returns Formatted string
 */
export function formatAllResults(results: Result[]): string {
  return results.map(formatResult).join('\n');
}

/**
 * Format results as JSON
 * @param results Array of detection results
 * @returns JSON string
 */
export function formatJson(results: Result[]): string {
  return JSON.stringify(results, null, 2);
}

/**
 * Parse CLI arguments
 * @param args Command line arguments
 * @returns Parsed options and tool names
 */
export function parseArgs(args: string[]): {
  tools: string[];
  json: boolean;
  help: boolean;
  version: boolean;
} {
  const json = args.includes('--json') || args.includes('-j');
  const help = args.includes('--help') || args.includes('-h');
  const version = args.includes('--version') || args.includes('-v');
  
  const tools = args.filter(arg => !arg.startsWith('-'));
  
  return { tools, json, help, version };
}

/**
 * Main CLI entry point
 * @param args Optional arguments for testing
 * @returns Exit code
 */
export function main(args?: string[]): number {
  const cliArgs = args ?? process.argv.slice(2);
  const { tools, json, help, version } = parseArgs(cliArgs);

  // Handle --help
  if (help) {
    showHelp();
    return 0;
  }

  // Handle --version
  if (version) {
    showVersion();
    return 0;
  }

  // Validate tool names
  const invalidTools = tools.filter(t => t !== 'all' && !isValidTool(t));
  if (invalidTools.length > 0) {
    console.error(`Error: Unknown tool(s): ${invalidTools.join(', ')}`);
    console.error(`Supported tools: ${SUPPORTED_TOOLS.join(', ')}`);
    return 1;
  }

  let results: Result[];

  if (tools.length === 0 || tools.includes('all')) {
    // No arguments or 'all', detect all tools
    results = detectAll();
  } else {
    // Detect specific tool(s)
    results = detectMultiple(tools as ToolName[]);
  }

  // Remove duplicate results
  const seen = new Set<string>();
  results = results.filter(r => {
    if (seen.has(r.name)) return false;
    seen.add(r.name);
    return true;
  });

  // Sort: installed first, then not installed
  results.sort((a, b) => {
    if (a.installed === b.installed) return 0;
    return a.installed ? -1 : 1;
  });

  if (json) {
    console.log(formatJson(results));
  } else {
    console.log(formatAllResults(results));
  }

  return 0;
}

// Run if this is the main module
import { fileURLToPath } from 'url';
const currentFile = fileURLToPath(import.meta.url);
const isMain = process.argv[1] === currentFile || 
               process.argv[1]?.endsWith('detect-agent') ||
               process.argv[1]?.endsWith('cli.js') || 
               process.argv[1]?.endsWith('cli.ts');
if (isMain) {
  const exitCode = main();
  process.exit(exitCode);
}
