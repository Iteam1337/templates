# :guitar: Iteam Express Mongo TS Template :fire:

## Setup

This template uses [@iteam/eslint-config-react](https://github.com/Iteam1337/eslint-config-react), so we need to configure it by installing its peer dependencies.

From the project root, run the following command:

```sh
npx install-peerdeps --dev @iteam/eslint-config-react
```

Then, install the rest of the dependencies:

```sh
npm install
```

### Soft setup

- Edit src/public/robots.txt
- Edit src/public/.well-known/security.txt
- Edit all matching `git grep '# TODO: CHANGE ME'`

## Recommended VSCode extensions

- ESLint
- Prettier

## Configuration

This template comes with a basic setup of Github Actions to lint and test code on PR:s made against `main`.

## TODO:

- [x] Setup Express
- [x] Setup CORS
- [x] Setup mongoose/mongdb
- [x] Setup example API endpoint
- [x] Setup common test infra around mongodb to get data isolation for each test
- [ ] Setup security headers?
- [ ] Look into mongodb/js ORM:s
- [ ] Look into api-swagger-docs-mapper
- [ ] Setup logging infra
- [ ] Setup Docker build
- [ ] Setup Github Actions CI/CD
- [ ] Setup Kubernetes deployment
- [ ] Use Kubernetes manifests for dependencies
- [ ] Update Readme
