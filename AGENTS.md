# AGENTS.md

Guidelines for AI agents working with this codebase.

## Project Overview

`detect-agent` is a CLI tool and npm library for detecting AI agent tools (Cursor, Claude Code, Gemini CLI, Codex) on the system.

## Tech Stack

- **Language**: TypeScript (ESM)
- **Runtime**: Node.js 20+
- **Testing**: Jest with ESM support
- **Build**: tsc

## Project Structure

```
src/
├── index.ts           # Public API exports
├── types.ts           # Type definitions (Result, DetectAgentError, ToolName)
├── cli.ts             # CLI entry point
└── detectors/
    ├── index.ts       # detect(), detectMultiple(), detectAll()
    ├── utils.ts       # findExecutable(), getVersion(), createResult()
    ├── cursor.ts      # Cursor detector
    ├── claude-code.ts # Claude Code detector
    ├── gemini.ts      # Gemini detector
    └── codex.ts       # Codex detector
```

## Commands

```bash
npm run build      # Compile TypeScript
npm test           # Run all tests
npm run test:coverage  # Run tests with coverage
npm run typecheck  # Type check without emit
```

## Code Conventions

### Language

- Code & Documentation: English
- Agent conversation output: Follow user's language

### TypeScript

- Use ESM modules (`.js` extension in imports)
- Strict mode enabled
- Export types with `export type { ... }`
- Export values with `export { ... }`

### Testing

- Test files: `*.test.ts` next to source files
- Use `@jest/globals` imports in ESM mode
- Mock console with `jest.fn()` for CLI tests

### Error Handling

- "Not installed" is NOT an error → return `{ installed: false }`
- Invalid tool names → throw `DetectAgentError`
- Unexpected errors → catch and return `{ installed: false }`

## Adding a New Detector

1. Create `src/detectors/<tool-name>.ts`:

```typescript
import type { Result } from '../types.js';
import { findExecutable, getVersion, createResult } from './utils.js';

const TOOL_NAME = '<tool-name>';
const COMMAND = '<command>';

export function detect<ToolName>(): Result {
  try {
    const path = findExecutable(COMMAND);
    if (!path) {
      return createResult(TOOL_NAME, false);
    }
    const version = getVersion(COMMAND);
    return createResult(TOOL_NAME, true, version, path);
  } catch {
    return createResult(TOOL_NAME, false);
  }
}
```

2. Register in `src/detectors/index.ts`:
   - Import the detector
   - Add to `detectorMap`

3. Update `src/types.ts`:
   - Add to `ToolName` union type
   - Add to `SUPPORTED_TOOLS` array

4. Add test file `src/detectors/<tool-name>.test.ts`

## Key Design Decisions

See `.discuss/` for design discussion records:

- **API Design**: Always return `Result` object (never null)
- **Version Format**: String only (no semver parsing)
- **Detection Method**: PATH lookup + `--version`
- **Extensibility**: No custom detectors in v1
