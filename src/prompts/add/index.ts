import { reset } from 'kolorist';
import p from 'prompts';
import * as types from './../../types';
import * as utils from '../../utils';
import { Util, UTIL_TEMPLATES } from '../create/constants';
import { ghActions } from './handlers';

const handlersMap: Record<Util, () => void> = {
  'gh-actions': ghActions,
};

const handleTemplateChoice = (val: Util) => handlersMap[val]();

export const add = () =>
  p(steps).then((val) => handleTemplateChoice(val.template));

const steps: p.PromptObject<'template'>[] = [
  {
    type: 'select',
    name: 'template',
    message: reset('Select a template:'),
    initial: 0,
    choices: UTIL_TEMPLATES.map(utils.templateAsSelectOption),
    format: (x: types.Template) => x.name,
  },
];
