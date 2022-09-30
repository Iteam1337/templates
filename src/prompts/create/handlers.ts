import p from 'prompts';
import fs from 'fs';
import path from 'path';
import { lightGreen } from 'kolorist';

import * as helpers from '../../helpers';
import * as utils from '../../utils';

import { TEMPLATES_DIRECTORY } from './constants';

const cwd = process.cwd();

export const makeTemplate = (result: p.Answers<string>) => {
  const root = path.join(cwd, result.targetDir);

  console.log(`\nScaffolding project in ${root}...`);
  fs.mkdirSync(root);

  const templateDir = path.join(TEMPLATES_DIRECTORY, result.template.name);

  fs.readdirSync(templateDir)
    .filter(utils.isNotPackageJson)
    .forEach((fileName) =>
      helpers.copy(
        path.join(templateDir, fileName),
        utils.getTargetPath(root, fileName)
      )
    );

  const packageJson = Object.assign(
    require(path.join(templateDir, 'package.json')),
    {
      name: result.targetDir,
    }
  );

  helpers.write(
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
};
