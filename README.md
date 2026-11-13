# 👷‍♀️ templates 👷

This repository contains Iteam project templates to scaffold new projects and a small CLI to initialize them.

## Dependency maintenance

The CLI and generated projects use pnpm with a four-day minimum release age and dependency build scripts disabled by default. Resolve audit findings by upgrading to patched package releases and verifying that the project still works. Dependency installation and updates continue to respect `minimumReleaseAge`; no audit command in CI changes the repository or its lockfiles.

Functional verification and dependency audits are independent GitHub checks. An unfixable advisory does not block either check, but remains visible in the audit job summary. pnpm fails the audit when the locked dependency graph has an actionable vulnerability. Registry failures still fail the check.

- Run both checks on every pull request and through the weekly template verification. Let Renovate propose dependency updates, but merge them only when CI passes.
- Upgrade to a compatible patched release first, then rerun the affected template verification.
- Configure audit severity and deliberate GHSA exceptions with pnpm's native `audit.level` and `audit.ignore` settings in the relevant template's `pnpm-workspace.yaml`. pnpm applies these settings consistently to local and CI audits.
- Review ignored advisories whenever dependencies change and remove exceptions as soon as they no longer apply. Prefer upgrades over exceptions; do not ignore an advisory merely to make CI green.

## Adding a new template

Add the template under `templates/` and register it in `src/constants.ts` so the CLI offers it. Then add its directory name to `scripts/templates.json` to include it in automated verification. This file is the single template list used by both the CLI scaffolding tests and the GitHub Actions matrix, so those files do not need separate list updates.

Validate the new template with `pnpm test` and `pnpm test:template <template>`.

## Verification

Run the CLI scaffolding tests:

```sh
pnpm test
```

Verify a generated project's frozen install, build, tests, lint (when available), server boot, and HTTP readiness:

```sh
pnpm test:template react
pnpm test:template react-ts
pnpm test:template vite-vanilla
pnpm test:template koa-ts
```

Audit a template's committed lockfile using its native pnpm configuration:

```sh
pnpm audit:template react
```

The audit command uses an isolated temporary copy, so pnpm cannot add ignored advisories to the working tree. The GitHub Actions workflow runs independent E2E and audit checks for every configured template on pull requests and weekly on Monday at 06:30 UTC (07:30 during CET and 08:30 during CEST). It can also be started manually with **Weekly template verification → Run workflow**. Each audit job includes a dependency and advisory summary.

## How to use

1. In your terminal, run:
```sh
pnpm create @iteam/templates@latest
```
2. You will be presented with the templates available (currently koa-typescript, react-typescript, react and vite)
3. When you choose a template, a sub-directory with a new project will be created.

### How to contribute

The CLI part of this project is responsible for "end user usage", as in when you use the CLI to install a new template. All the source code for the CLI is in the `src` directory.

When you run `pnpm build` from the root, we bundle the source files into `./index.js`. Later, when this CLI is used, said `./index.js` is executed, effectively running the CLI script in the terminal of the consumer.

You can test the script locally by running:

```sh
pnpm build
node index.js
```

This project is set up with [semantic-release](https://github.com/semantic-release/semantic-release).
Every push to the main branch will trigger a Github Actions workflow (`./.github/workflows/release`).

This workflow will do the following:

- Run tests

- Run `npx semantic-relase`, which will in turn:

  - Analyze the commits since the last release, using the commit names based on [conventional-commits](https://www.conventionalcommits.org/en/v1.0.0/)

  - If eligible\*, create a new SemVer version tag based on the commit names
  - If eligible\*, publish a new version of this library to NPM at `@iteam/create-templates`
  - If eligible\*, append the new version to the changelog\
     \
     \* _Eligible means if the commits since the last release motivates a new release, where commit name `fix:` motivates a patch version, `feat:` motivates a minor version, and `BREAKING CHANGE`(footer) motivates a major version._
    _Read more at [conventional-commits](https://www.conventionalcommits.org/en/v1.0.0/#summary)_
