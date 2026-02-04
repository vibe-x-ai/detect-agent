# detect-agent

Detect AI agent tools (Cursor, Claude Code, Gemini CLI, Codex, Windsurf, GitHub Copilot, OpenCode, Qoder) and report their installation status and version.

## Installation

```bash
npm install -g detect-agent
```

## CLI Usage

```bash
# Detect all supported tools
detect-agent

# Detect a specific tool
detect-agent cursor

# Detect multiple tools
detect-agent cursor gemini

# Output as JSON
detect-agent --json
detect-agent cursor --json

# Show help
detect-agent --help

# Show version
detect-agent --version
```

### CLI Output Example

```
cursor      : installed (v0.47.0) - /usr/local/bin/cursor
claude-code : not installed
gemini      : installed (v0.1.0) - /usr/local/bin/gemini
codex       : not installed
windsurf    : installed (v1.0.0) - ~/.codeium/windsurf/bin/windsurf
copilot     : installed (v1.2.3) - /usr/local/bin/copilot
opencode    : not installed
qoder       : not installed
```

### JSON Output Example

```json
[
  {
    "name": "cursor",
    "installed": true,
    "version": "0.47.0",
    "path": "/usr/local/bin/cursor"
  },
  {
    "name": "claude-code",
    "installed": false
  }
]
```

## API Usage

```typescript
import { detect, detectMultiple, detectAll, isValidTool } from 'detect-agent';

// Detect a single tool
const result = detect('cursor');
console.log(result);
// { name: 'cursor', installed: true, version: '0.47.0', path: '/usr/local/bin/cursor' }

// Detect multiple tools
const results = detectMultiple(['cursor', 'gemini']);
console.log(results);

// Detect all supported tools
const allResults = detectAll();
console.log(allResults);

// Check if a tool name is valid
if (isValidTool('cursor')) {
  const result = detect('cursor');
}
```

## Supported Tools

| Tool | CLI Name | Description |
|------|----------|-------------|
| Cursor | `cursor` | Cursor IDE CLI |
| Claude Code | `claude-code` | Anthropic Claude Code CLI |
| Gemini CLI | `gemini` | Google Gemini CLI |
| Codex | `codex` | OpenAI Codex CLI |
| Windsurf | `windsurf` | Codeium Windsurf IDE CLI |
| GitHub Copilot | `copilot` | GitHub Copilot CLI |
| OpenCode | `opencode` | OpenCode CLI |
| Qoder | `qoder` | Qoder CLI |

## Types

```typescript
interface Result {
  name: string;        // Tool name ('cursor', 'claude-code', etc.)
  installed: boolean;  // Whether the tool is installed
  version?: string;    // Version string if installed
  path?: string;       // Path to executable if installed
}

type ToolName = 'cursor' | 'claude-code' | 'gemini' | 'codex' | 'windsurf' | 'copilot' | 'opencode' | 'qoder';

const SUPPORTED_TOOLS: ToolName[] = ['cursor', 'claude-code', 'gemini', 'codex', 'windsurf', 'copilot', 'opencode', 'qoder'];

class DetectAgentError extends Error {
  tool: string;
  cause: Error;
}
```

## Error Handling

- "Not installed" is NOT an error - returns `{ installed: false }`
- Invalid tool names throw `DetectAgentError`
- Unexpected errors (subprocess crash, permission issues) are caught and return `{ installed: false }`

## Requirements

- Node.js 20.x or higher
- Cross-platform (Linux, macOS, Windows)

## License

MIT
