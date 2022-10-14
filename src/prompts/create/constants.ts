import { blue, yellow, red, green } from 'kolorist';

import * as types from '../../types';

export const PROJECT_TEMPLATES_DIRECTORY = `${__dirname}/templates`;

export const PROJECT_TEMPLATES: Array<types.Template> = [
  {
    color: yellow,
    name: 'react',
    label: 'React JavaScript',
  },
  {
    color: blue,
    name: 'react-ts',
    label: 'React TypeScript',
  },
  {
    color: red,
    name: 'vite-vanilla',
    label: 'Vite JavaScript',
  },
  {
    color: green,
    name: 'koa-ts',
    label: 'Koa Typescript',
  },
];

export type Util = 'gh-actions';

export const UTIL_TEMPLATES: Array<types.Template<Util>> = [
  {
    color: yellow,
    name: 'gh-actions',
    label: 'Github Actions (on PR)',
  },
];
