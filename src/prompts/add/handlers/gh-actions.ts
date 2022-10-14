import fs from 'fs';
import path from 'path';
import { lightGreen } from 'kolorist';

import * as helpers from '../../../helpers';
import * as utils from '../../../utils';

const cwd = process.cwd();

export const ghActions = () => {
  const root = path.join(cwd);

  console.log(`\nAdding gh actions to ${root}...`);
  console.log('this is root', root);

  const templateDir = path.join(
    PROJECT_TEMPLATES_DIRECTORY,
    result.template.name
  );

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
