import { blue, yellow, red } from 'kolorist'

import * as types from './types'

export const TEMPLATES_DIRECTORY = `${__dirname}/templates`
export const RENAMABLE_FILES_MAP: { [key: string]: string } = {
  _gitignore: '.gitignore',
}

export const TEMPLATES: types.Template[] = [
  {
    name: 'react',
    color: yellow,
    variants: [
      {
        color: yellow,
        name: 'react',
        display: 'JavaScript',
      },
      {
        color: blue,
        name: 'react-ts',
        display: 'TypeScript',
      },
      {
        color: red,
        name: 'vite-vanilla',
        display: 'JavaScript',
      },
    ],
  },
]
