# D01: Core API Design

## Status: Confirmed

## Decision

### Package Structure
- **Name**: `detect-agent`
- **Type**: Dual-mode package (library + CLI)

### Supported Tools
- Cursor CLI (`cursor`)
- Claude Code (`claude-code`)
- Gemini CLI (`gemini`)
- OpenAI Codex (`codex`)

### Environment
- Node.js: 20.x minimum
- OS: Cross-platform (Linux, macOS, Windows)

### API Design
```typescript
// Single detection
detect('cursor'): Result

// Multiple detection
detect(['cursor', 'claude-code']): Result[]

// Detect all supported tools
detectAll(): Result[]
```

### Return Type
```typescript
interface Result {
  name: string;        // 'cursor', 'claude-code', etc.
  installed: boolean;  // Always present
  version?: string;    // Present if installed
  path?: string;       // Path to executable if found
}

class DetectAgentError extends Error {
  tool: string;
  cause: Error;
}
```

### Error Handling
- "Not installed" is NOT an error → returns `Result { installed: false }`
- Unexpected errors (subprocess crash, permission issues) → throw `DetectAgentError`
- User can catch errors and decide how to handle

### CLI Interface
```bash
detect-agent cursor      # Single tool
detect-agent all         # All tools
detect-agent --json      # JSON output (default: readable text)
```

### Version Format
- String format (e.g., "0.47.0") — no parsing into major/minor/patch

### Detection Method
- PATH lookup (which/whereis) + `--version` execution
- No package manager checks (too OS-specific and slow)

### Extensibility
- v1: No custom detector registration (keep simple)
- Future: May add `registerDetector()` if requested

### Code Structure
```
src/
  ├── index.ts           # Main exports (detect, detectAll)
  ├── types.ts           # Result, DetectAgentError
  ├── cli.ts             # CLI entry point
  └── detectors/
      ├── cursor.ts
      ├── claude-code.ts
      ├── gemini.ts
      └── codex.ts
```

## Reasoning
1. Always return `Result` (never null/undefined) makes TypeScript types predictable
2. `installed: false` cleanly represents "not found" state
3. String version is simpler and avoids parsing edge cases
4. Errors that are truly exceptional should throw, not pollute results
5. CLI + library dual-mode maximizes utility
6. PATH + --version is sufficient for all 4 target tools
7. Simple directory structure makes contribution easy
