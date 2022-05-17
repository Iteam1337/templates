import p from 'prompts';
import fs from 'fs';
import path from 'path';
import { lightYellow, lightGreen, reset } from 'kolorist';

import * as helpers from '../../helpers';
import * as utils from '../../utils';

import { TEMPLATES, TEMPLATES_DIRECTORY } from '../../constants';
import * as types from 'src/types';
import { makeTemplate } from './handlers';

const cwd = process.cwd();

export function create() {
  const templates = TEMPLATES.flatMap((f) => f.variants);

  let steps: p.PromptObject[] = [
    {
      type: 'text',
      name: 'targetDir',
      message: 'Project name:',
      initial: 'my-awesome-project',
      onState: ({ value = '' }) => value.trim(),
      validate: (state) => console.log('first state: ', state)! || true,
    },
    {
      type: (_, state) => {
        if (fs.existsSync(state.targetDir)) {
          throw new Error('Target directory is not empty. Please try again.');
        }

        return 'confirm';
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

  return p(steps).then(
    (res) => console.log(res)! || makeTemplate(targetDir, res)
  );
}
