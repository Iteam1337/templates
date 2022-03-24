import prompts from 'prompts'
import fs from 'fs'
import path from 'path'
import functions from './functions'
import * as types from './types'

import { yellow, green, cyan, blue, red, reset } from 'kolorist'

const cwd = process.cwd()

const TEMPLATES_DIRECTORY = `${__dirname}/../templates`
const RENAMABLE_FILES_MAP: { [key: string]: string } = {
  _gitignore: '.gitignore',
}

const TEMPLATES: types.Template[] = [
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
    ],
  },
]

function useState<T>(initialState?: T): [T, (key: keyof T, val: any) => void] {
  let state: T = Object.assign({}, initialState)

  const setState = (key: keyof T, val: any) => {
    state[key] = val
  }

  return [state, setState]
}

type State = {
  targetDir: string
}

const initialState = {
  targetDir: '',
}

const init = async () => {
  const [state, setState] = useState<State>(initialState)

  const templates = TEMPLATES.map((f) => f.variants).reduce(
    (a, b) => a.concat(b),
    []
  )

  let steps: prompts.PromptObject[] = [
    {
      type: 'text',
      name: 'projectName',
      message: 'Project name:',
      initial: 'my-awesome-project',
      onState: ({ value }: { value: any }) =>
        setState('targetDir', value.trim()),
    },
    {
      type: () => {
        if (fs.existsSync(state.targetDir) ? 'confirm' : null) {
          throw new Error('Target directory is not empty. Please try again.')
        }

        return null
      },
      name: 'exitInvalidDir',
    },
    {
      type: () =>
        functions.isValidPackageName(state.targetDir) ? null : 'text',
      name: 'packageName',
      message: reset('Package name:'),
      initial: () => functions.toValidPackageName(state.targetDir),
      validate: (dir) =>
        functions.isValidPackageName(dir) || 'Invalid package.json name',
    },
    {
      type: 'select',
      name: 'template',
      message: reset('Select a template:'),
      initial: 0,
      choices: templates.map((template) => ({
        title: template.color(template.name),
        value: template,
      })),
    },
  ]

  const result = await prompts(steps)

  const root = path.join(cwd, state.targetDir)
  fs.mkdirSync(root)

  const templateDir = path.join(TEMPLATES_DIRECTORY, result.template.name)
  console.log(`\nScaffolding project in ${root}...`)

  const getTargetPath = (targetPath: string, fileName: string) =>
    path.join(targetPath, RENAMABLE_FILES_MAP[fileName] ?? fileName)

  fs.readdirSync(templateDir)
    .filter(functions.isNotPackageJson)
    .forEach((fileName) =>
      functions.copy(
        path.join(templateDir, fileName),
        getTargetPath(root, fileName)
      )
    )

  const packageJson = Object.assign(
    require(path.join(templateDir, `package.json`)),
    {
      name: result.packageName,
    }
  )

  functions.write(
    getTargetPath(root, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  )

  const pkgInfo = functions.pkgFromUserAgent(process.env.npm_config_user_agent)
  const pkgManager = pkgInfo ? pkgInfo.name : 'npm'

  console.log(`\Finished!. Now run:\n`)
  if (root !== cwd) {
    console.log(`  cd ${path.relative(cwd, root)}`)
  }

  switch (pkgManager) {
    case 'yarn':
      console.log('  yarn')
      console.log('  yarn dev')
      break
    default:
      console.log(`  ${pkgManager} install`)
      console.log(`  ${pkgManager} run dev`)
      break
  }
}

init().catch(({ message }) => console.error(message))
