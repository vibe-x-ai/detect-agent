# Detect Agent v2 Roadmap

## 🔵 Current Focus
(All tasks completed - v2 implemented)

## ⚪ Pending
(None)

## ✅ Confirmed
- New tools for v2:
  - Windsurf
  - OpenCode
  - Qoder
  - GitHub Copilot
- Implementation priority: Windsurf > Copilot > OpenCode > Qoder
- Detection method: Keep v1's simple approach (findExecutable + getVersion), no layering
- CLI commands confirmed:
  - OpenCode: `opencode`
  - GitHub Copilot CLI: `copilot`
  - Qoder: `qoder`
  - Windsurf: `windsurf` (install path: `~/.codeium/windsurf/bin/windsurf`)
- Implementation completed: 2026-02-04

## ❌ Rejected
- Layered detection (high-confidence CLI + low-confidence config files): Not implementing, keep it simple
