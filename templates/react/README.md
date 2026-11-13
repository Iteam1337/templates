# :guitar: Iteam React JS Template :fire:

## Setup

This template uses [@iteam/eslint-config-react](https://github.com/Iteam1337/eslint-config-react), so we need to configure it by installing its peer dependencies.

From the project root, run the following command:

```sh
pnpm dlx install-peerdeps --dev @iteam/eslint-config-react
```

Then, install the rest of the dependencies:

```sh
pnpm install
```

## Recommended VSCode extensions

- ESLint
- Prettier
- Tailwind CSS Intellisense

## Configuration

This template comes with a basic setup of Github Actions to lint and test code on PR:s made against `main`.

## Dependency maintenance

This project uses pnpm with a four-day minimum release age and dependency build scripts disabled by default. Resolve audit findings by upgrading to patched package releases and running the tests. Avoid version overrides and audit suppressions, which require ongoing manual monitoring.
