import p from 'prompts';

import * as utils from '../../utils';

export const add = () => p(steps).then(console.log);

const steps: p.PromptObject[] = [
  {
    type: 'text',
    name: 'targetDir',
    message: 'Project name:',
    initial: 'my-awesome-project',
    onState: ({ value = '' }) => value.trim(),
    validate: utils.validateProjectName,
  },
];
