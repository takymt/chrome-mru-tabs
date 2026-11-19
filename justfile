default:
    @just --list

setup:
    pnpm install
    lefthook install

build:
    pnpm exec rolldown -c

fmt:
    pnpm exec oxfmt

fmt-check:
    pnpm exec oxfmt --check

lint:
    pnpm exec oxlint --deny-warnings

lint-fix:
    pnpm exec oxlint --fix --deny-warnings

test:
    pnpm exec vitest run --dir tests

check: lint fmt-check test
