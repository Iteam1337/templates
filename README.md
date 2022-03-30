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
