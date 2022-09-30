#!/usr/bin/env node

import * as types from './types';
import * as prompts from './prompts';
import * as utils from './utils';

const commandHandlers: Record<types.Command, () => Promise<void>> = {
  add: prompts.add,
  create: prompts.create,
};

const handleCommand = (command: types.Command) => commandHandlers[command]();

prompts.start().then(handleCommand).catch(utils.handleError);
