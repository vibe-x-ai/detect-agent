# Detect Agent CLI - Design Discussion

## 🔵 Current Focus
(All design decisions finalized)

## ⚪ Pending
(All decisions confirmed)

## ✅ Confirmed
- Scope: Detect installation status + version number only
- Dual interface: Both as npm package (library) AND CLI tool
- Package name: `detect-agent`
- Tool list: Cursor CLI, Claude Code, Gemini CLI, Codex
- OS support: Cross-platform (Linux, macOS, Windows)
- Node.js minimum: 20.x
- Version format: String (e.g., "0.47.0")
- API Design:
  - `detect('cursor')` - Single tool detection
  - `detect(['cursor', 'claude-code'])` - Multiple tools
  - `detectAll()` - All supported tools
  - CLI: `detect-agent cursor`, `detect-agent all`
- Return type: Always returns `Result` object (never null)
  - `{ name, installed, version?, path? }`
  - `installed: false` when not found (not an error)
  - Unexpected errors throw `DetectAgentError`
- CLI output: Default readable text, `--json` for JSON output
- Detection method: PATH lookup + `--version`
- Extensibility: No custom detectors in v1 (keep simple)
- Code structure: src/{index.ts, types.ts, cli.ts, detectors/*.ts}

## ❌ Rejected
(Empty initially)
