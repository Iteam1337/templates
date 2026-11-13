// https://github.com/marvinhagemeister/kolorist/blob/main/src/index.ts
import { blue, yellow, red, green } from 'kolorist'

import type { Template } from './types.ts'

export const TEMPLATES = [
  {
    name: 'react',
    color: yellow,
    variants: [
      {
        color: yellow,
        name: 'react',
        display: 'React JavaScript',
      },
      {
        color: blue,
        name: 'react-ts',
        display: 'React TypeScript',
      },
      {
        color: red,
        name: 'vite-vanilla',
        display: 'Vite JavaScript',
      },
      {
        color: green,
        name: 'koa-ts',
        display: 'Koa Typescript',
      },
    ],
  },
] satisfies Template[]

export const TEMPLATE_VARIANTS = TEMPLATES.flatMap(({ variants }) => variants)
