# D01: v2 Tool List and Detection Strategy

**Status**: ✅ Confirmed  
**Date**: 2026-02-04  
**Context**: detect-agent v2 roadmap discussion

## Decision

### v2 New Tools

The following tools will be added in v2:

| Tool | CLI Command | Version Command | Priority |
|------|-------------|-----------------|----------|
| Windsurf | `windsurf` | `windsurf --version` | 1 |
| GitHub Copilot CLI | `copilot` | `copilot --version` | 2 |
| OpenCode | `opencode` | `opencode --version` | 3 |
| Qoder | `qoder` | `qoder --version` | 4 |

### Detection Strategy

Keep the same detection approach as v1:

1. **findExecutable**: Use `which` (macOS/Linux) or `where` (Windows) to find CLI
2. **getVersion**: Run `<command> --version` to get version string

This approach provides high confidence detection - if the command exists and returns a version, the tool is definitively installed.

## Alternatives Considered

### Layered Detection (Rejected)

We discussed adding a secondary detection layer using config file paths (e.g., `~/.config/tool/`), but rejected it because:

- Config files may remain after uninstallation (false positives)
- Adds complexity without clear value
- Current CLI-based detection is sufficient and reliable

### IDE Application Detection (Not Needed)

Initially we thought Windsurf might need special handling as an IDE, but verified that it provides a `windsurf` CLI command (similar to Cursor), so standard detection works.

## Implementation Notes

- All 4 tools can use the existing `utils.ts` helper functions
- Each tool gets a separate detector file following the v1 pattern
- Update `types.ts` to add new tool names to `ToolName` type
