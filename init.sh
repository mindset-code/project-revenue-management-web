#!/usr/bin/env bash
set -euo pipefail
PROJECT_NAME="project-revenue-management-web"
PASS=0; FAIL=0
green() { echo -e "\033[32m✓ $1\033[0m"; }
red()   { echo -e "\033[31m✗ $1\033[0m"; }
warn()  { echo -e "\033[33m⚠ $1\033[0m"; }
check() {
  local label="$1"; shift
  if "$@" &>/dev/null; then
    green "$label"; PASS=$((PASS + 1))
  else
    red "$label"; FAIL=$((FAIL + 1))
  fi
}
echo -e "\033[36m→ $PROJECT_NAME — verificación pre-sesión\033[0m"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "\033[36m→ Estructura\033[0m"
check "index.html existe"         test -f index.html
check "script.js existe"          test -f script.js
check "styles.css existe"         test -f styles.css
check "README.md existe"          test -f README.md
check "CLAUDE.md en .gitignore"   grep -q "CLAUDE.md" .gitignore
echo -e "\033[36m→ Git\033[0m"
UNCOMMITTED=$(git status --porcelain 2>/dev/null | wc -l)
[[ "$UNCOMMITTED" -gt 0 ]] && warn "$UNCOMMITTED archivo(s) sin commit"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Resultado: $PASS ✓  $FAIL ✗"
[[ "$FAIL" -eq 0 ]] && green "Proyecto verificado — puedes empezar" || red "Corrige los fallos antes de continuar"
exit "$FAIL"
