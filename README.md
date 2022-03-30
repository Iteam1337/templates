# 👷‍♀️ templates 👷

This repository contains Iteam project templates to scaffold new projects and a small CLI to initialize them.

## How to use

In your terminal, run:

```sh
npm init @iteam/templates@latest
```

### How to contribute

The CLI part of this project is responsible for "end user usage", as in when you use the CLI to install a new template. All the source code for the CLI is in the `src` directory.

When you run `npm run build` from the root, we bundle the source files into `./index.js`. Later, when this CLI is used, said `./index.js` is executed, effectively running the CLI script in the terminal of the consumer.

You can test the script locally by running:

```sh
npm run build
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
