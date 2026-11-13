# 👷‍♀️ templates 👷

This repository contains Iteam project templates to scaffold new projects and a small CLI to initialize them.

## How to use

This tool and the projects it creates use [pnpm](https://pnpm.io/), a JavaScript package manager that installs dependencies and runs project scripts. If you are new to pnpm, install Node.js using the version in `.nvmrc` or `.tool-versions`, then follow the [pnpm installation guide](https://pnpm.io/installation).

We support pnpm only. Following Shai-Hulud, our assessment was that pnpm was the only package manager making meaningful supply-chain security improvements at the pace we needed. Its release-age quarantine, dependency build-script controls, frozen lockfiles, and audit policies help us reduce the risk of installing compromised packages.

1. In your terminal, run:
```sh
pnpm create @iteam/templates@latest
```
2. You will be presented with the templates available (currently koa-typescript, react-typescript, react and vite)
3. When you choose a template, a sub-directory with a new project will be created.
4. Open the new project directory:
```sh
cd my-awesome-project
```
5. Install its dependencies and start the development server:
```sh
pnpm install
pnpm run dev
```

## How to contribute

The CLI part of this project is responsible for "end user usage", as in when you use the CLI to install a new template. All the source code for the CLI is in the `src` directory.

When you run `pnpm build` from the root, we bundle the source files into `./index.js`. Later, when this CLI is used, said `./index.js` is executed, effectively running the CLI script in the terminal of the consumer.

You can test the script locally by running:

```sh
pnpm build
node index.js
```

### Verification

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

### Adding a new template

Add the template under `templates/` and register its variant in `src/templates.ts` with its directory name, display label, and color. This typed `TEMPLATES` definition is the single source of truth for the CLI, scaffolding tests, and both GitHub Actions matrices, so this list nees to be kept up to date whenever new templates are added.

Validate the new template with `pnpm test` and `pnpm test:template <template>`.

### Dependency maintenance

The CLI and generated projects use pnpm with a four-day minimum release age and dependency build scripts disabled by default. Resolve audit findings by upgrading to patched package releases and verifying that the project still works.

A weekly template verification workflow runs to ensure that all templates are still functional and have no fixable outstanding audit issues.
An unfixable advisory does not block either check, but remains visible in the audit job summary. pnpm fails the audit when the locked dependency graph has an actionable vulnerability.

- We run both checks on every pull request and through the weekly template verification.
- The weekly check runs weekly on Mondays at 06:30 UTC (07:30 during CET and 08:30 during CEST)
- Renovate should only merge updates that still pass CI, both functionally using the E2E tests and the pnpm dependency audits ran on every PR.
- The strategy should be to upgrade to a compatible patched release first, then rerun the affected template verification.

### Releasing

This project is set up with [semantic-release](https://github.com/semantic-release/semantic-release).
Every push to the main branch will trigger a Github Actions workflow (`./.github/workflows/release`).

This workflow will do the following:

- Run tests

- Run `pnpm exec semantic-release`, which will in turn:

  - Analyze the commits since the last release, using the commit names based on [conventional-commits](https://www.conventionalcommits.org/en/v1.0.0/)

  - If eligible\*, create a new SemVer version tag based on the commit names
  - If eligible\*, publish a new version of this library to NPM at `@iteam/create-templates`
  - If eligible\*, append the new version to the changelog\
     \
     \* _Eligible means if the commits since the last release motivates a new release, where commit name `fix:` motivates a patch version, `feat:` motivates a minor version, and `BREAKING CHANGE`(footer) motivates a major version._
    _Read more at [conventional-commits](https://www.conventionalcommits.org/en/v1.0.0/#summary)_
