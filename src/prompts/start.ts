import p from 'prompts';
import { lightGreen, lightYellow } from 'kolorist';

import * as types from '../types';

export const start = () =>
  p(steps).then((result) => result.command as types.Command);

const options: Array<types.SelectOption<types.Command>> = [
  {
    title: lightYellow('New project'),
    value: 'create',
  },
  {
    title: lightGreen('Add a feature to an existing project'),
    value: 'add',
  },
];

const steps: Array<p.PromptObject<'command'>> = [
  {
    type: 'select',
    name: 'command',
    message: 'What would you like to do?',
    choices: options,
  },
];
