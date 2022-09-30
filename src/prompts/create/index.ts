import p from 'prompts';
import fs from 'fs';
import { reset } from 'kolorist';

import * as utils from '../../utils';
import { TEMPLATES } from '../../constants';
import { makeTemplate } from './handlers';

export const create = () => p(steps).then(makeTemplate);

const templatesAsSelectOptions = TEMPLATES.flatMap((f) => f.variants).map(
  utils.templateAsSelectOption
);

const validateProjectName = (val: string) =>
  fs.existsSync(val)
    ? 'Target directory already exists'
      ? !utils.isValidPkgName(val)
      : 'Not a valid package name, try a different one'
    : true;
const steps: p.PromptObject[] = [
  {
    type: 'text',
    name: 'targetDir',
    message: 'Project name:',
    initial: 'my-awesome-project',
    onState: ({ value = '' }) => value.trim(),
    validate: validateProjectName,
  },
  {
    type: 'select',
    name: 'template',
    message: reset('Select a template:'),
    initial: 0,
    choices: templatesAsSelectOptions,
  },
];
