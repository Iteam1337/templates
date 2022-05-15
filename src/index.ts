#!/usr/bin/env node

import * as types from './types';
import * as prompts from './prompts';
import * as utils from './utils';

(async () => {
  const handleCommand = (command: types.Command) => {
    const commandHandlers: Record<types.Command, () => Promise<void>> = {
      add: prompts.create,
      create: prompts.create,
    };

    return commandHandlers[command]();
  };

  return prompts.start().then(handleCommand);
})().catch(utils.handleError);
