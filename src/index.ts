import prompts from 'prompts'
import fs from 'fs'
import path from 'path'
import { green, reset } from 'kolorist'

import * as functions from './functions'
import * as utils from './utils'
import {
  RENAMABLE_FILES_MAP,
  TEMPLATES,
  TEMPLATES_DIRECTORY,
} from './constants'

const cwd = process.cwd()

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

  const templates = TEMPLATES.flatMap((f) => f.variants)

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
      type: () => (utils.isValidPkgName(state.targetDir) ? null : 'text'),
      name: 'packageName',
      message: reset('Package name:'),
      initial: () => utils.toValidPackageName(state.targetDir),
      validate: (dir) =>
        utils.isValidPkgName(dir) || 'Invalid package.json name',
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
  console.log(`\nScaffolding project in ${root}...`)

  fs.mkdirSync(root)
  const templateDir = path.join(TEMPLATES_DIRECTORY, result.template.name)

  fs.readdirSync(templateDir)
    .filter(utils.isNotPackageJson)
    .forEach((fileName) =>
      functions.copy(
        path.join(templateDir, fileName),
        utils.getTargetPath(root, fileName)
      )
    )

  const packageJson = Object.assign(
    require(path.join(templateDir, 'package.json')),
    {
      name: result.packageName,
    }
  )

  functions.write(
    utils.getTargetPath(root, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  )

  const pkgManager =
    utils.getPkgManagerFromUserAgent(process.env.npm_config_user_agent) ?? 'npm'

  console.log(green(`\nFinished! Now run:\n`))

  if (root !== cwd) {
    console.log(`  cd ${path.relative(cwd, root)}`)
  }

  console.log(utils.installInstructionsByPkgManager(pkgManager))
}

init().catch(({ message }) => console.error(message))
