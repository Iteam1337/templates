import p from 'prompts';
import fs from 'fs';
import path from 'path';
import { lightYellow, lightGreen, reset } from 'kolorist';

import * as functions from '../functions';
import * as utils from '../utils';

import { TEMPLATES, TEMPLATES_DIRECTORY } from '../constants';
import * as types from 'src/types';

const cwd = process.cwd();

export function create() {
  let targetDir = '';

  const templates = TEMPLATES.flatMap((f) => f.variants);

  let steps: p.PromptObject[] = [
    {
      type: 'text',
      name: 'projectName',
      message: 'Project name:',
      initial: 'my-awesome-project',
      onState: ({ value = '' }) => (targetDir = value.trim()),
    },
    {
      type: () => {
        if (fs.existsSync(targetDir) ? 'confirm' : null) {
          throw new Error('Target directory is not empty. Please try again.');
        }
        return null;
      },
      name: 'exitInvalidDir',
    },
    {
      type: () => (utils.isValidPkgName(targetDir) ? null : 'text'),
      name: 'packageName',
      message: reset('Package name:'),
      initial: () => utils.toValidPackageName(targetDir),
      validate: (dir) =>
        utils.isValidPkgName(dir) || 'Invalid package.json name',
    },
    {
      type: 'select',
      name: 'template',
      message: reset('Select a template:'),
      initial: 0,
      choices: templates.map(utils.templateAsSelectOption),
    },
  ];

  return p(steps).then((result) => {
    const root = path.join(cwd, targetDir);

    console.log(`\nScaffolding project in ${root}...`);
    fs.mkdirSync(root);

    const templateDir = path.join(TEMPLATES_DIRECTORY, result.template.name);

    fs.readdirSync(templateDir)
      .filter(utils.isNotPackageJson)
      .forEach((fileName) =>
        functions.copy(
          path.join(templateDir, fileName),
          utils.getTargetPath(root, fileName)
        )
      );

    const packageJson = Object.assign(
      require(path.join(templateDir, 'package.json')),
      {
        name: result.packageName,
      }
    );

    functions.write(
      utils.getTargetPath(root, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );

    const pkgManager =
      utils.getPkgManagerFromUserAgent(process.env.npm_config_user_agent) ??
      'npm';

    console.log(lightGreen(`\nFinished! Now run:\n`));

    if (root !== cwd) {
      console.log(`  cd ${path.relative(cwd, root)}`);
    }

    console.log(utils.installInstructionsByPkgManager(pkgManager));
  });
}
