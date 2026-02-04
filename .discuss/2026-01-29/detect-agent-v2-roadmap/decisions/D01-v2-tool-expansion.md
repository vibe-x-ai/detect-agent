# D01: v2 Tool Expansion

## Status: Confirmed

## Decision

### v2 New Tools

| Tool | CLI Name | Priority | Notes |
|------|----------|----------|-------|
| **Windsurf** | `windsurf` | High | Similar to Cursor |
| **OpenCode** | `opencode` | Medium | Verify CLI availability |
| **Qoder** | `qoder` | Medium | Verify CLI availability |
| **GitHub Copilot** | `copilot` | Medium | `@github/github-copilot` |

### v1 Tools (Still Supported)
- Cursor CLI (`cursor`)
- Claude Code (`claude-code`)
- Gemini CLI (`gemini`)
- OpenAI Codex (`codex`)

### Implementation Priority
1. Windsurf (high demand, known CLI)
2. GitHub Copilot (popular, official CLI)
3. OpenCode (verify availability)
4. Qoder (verify availability)

## To Be Determined
- Detection specifics for OpenCode and Qoder
- `--version` flag patterns for each
