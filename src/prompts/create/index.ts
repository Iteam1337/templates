import p from 'prompts';
import { reset } from 'kolorist';

import * as utils from '../../utils';
import { TEMPLATES } from './constants';
import { makeTemplate } from './handlers';

export const create = () => p(steps).then(makeTemplate);

const templatesAsSelectOptions = TEMPLATES.flatMap((f) => f.variants).map(
  utils.templateAsSelectOption
);

const steps: p.PromptObject[] = [
  {
    type: 'text',
    name: 'targetDir',
    message: 'Project name:',
    initial: 'my-awesome-project',
    onState: ({ value = '' }) => value.trim(),
    validate: utils.validateProjectName,
  },
  {
    type: 'select',
    name: 'template',
    message: reset('Select a template:'),
    initial: 0,
    choices: templatesAsSelectOptions,
  },
];
