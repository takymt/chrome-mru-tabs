#!/bin/bash
set -euo pipefail

subject=$(head -n 1 "$1")

case "$subject" in
  "Merge "* | "Revert \""* | "fixup! "* | "squash! "* | "amend! "*) exit 0 ;;
esac

types="build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test"

if printf '%s\n' "$subject" | grep -Eq "^($types)(\([a-z0-9._/-]+\))?!?: [^ ]"; then
  exit 0
fi

cat >&2 <<EOF
Invalid commit message: "$subject"

Expected: <type>[(scope)][!]: <description>
Types:    $(printf '%s' "$types" | sed 's/|/, /g')
EOF
exit 1
