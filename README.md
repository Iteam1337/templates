# 👷‍♀️ templates 👷

This repository contains Iteam project templates to scaffold new projects and a small CLI to initialize them.

## Dependency maintenance

The CLI and generated projects use pnpm with a four-day minimum release age and dependency build scripts disabled by default. Resolve audit findings by upgrading to patched package releases and verifying that the project still works. Avoid version overrides and audit suppressions: they create an ongoing monitoring burden and can hide newly introduced issues.

When an upstream development dependency has no compatible patched release, a specific advisory can be documented temporarily in `audit-allowlist.json`. The template verification rejects every finding not on that list. This repository-only exception file is not copied into generated projects.

## How to use

1. In your terminal, run:
```sh
npm init @iteam/templates@latest
```
2. You will be presented with the templates available (currently koa-typescript, react-typescript, react and vite)
3. When you choose a template, a sub-directory with a new project will be created.

### How to contribute

The CLI part of this project is responsible for "end user usage", as in when you use the CLI to install a new template. All the source code for the CLI is in the `src` directory.

When you run `npm run build` from the root, we bundle the source files into `./index.js`. Later, when this CLI is used, said `./index.js` is executed, effectively running the CLI script in the terminal of the consumer.

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
