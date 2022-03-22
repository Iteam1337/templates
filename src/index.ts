import prompts from 'prompts'
import fs from 'fs'
import path from 'path'

import {
  yellow,
  green,
  cyan,
  blue,
  magenta,
  lightRed,
  red,
  reset,
} from 'kolorist'

const cwd = process.cwd()

const RENAMABLE_FILES_MAP: { [key: string]: string } = {
  _gitignore: '.gitignore',
}

type Template = {
  name: string
  color: any
  variants: TemplateVariant[]
}

type TemplateVariant = Omit<Template, 'variants'> & { display: string }

const TEMPLATES: Template[] = [
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
      type: () => (isValidPackageName(state.targetDir) ? null : 'text'),
      name: 'packageName',
      message: reset('Package name:'),
      initial: () => toValidPackageName(state.targetDir),
      validate: (dir) => isValidPackageName(dir) || 'Invalid package.json name',
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

  const templateDir = path.join(__dirname, `template--${result.template.name}`)
  console.log(`\nScaffolding project in ${root}...`)

  function copyDir(srcDir: string, destDir: string) {
    fs.mkdirSync(destDir, { recursive: true })

    for (const file of fs.readdirSync(srcDir)) {
      const srcFile = path.resolve(srcDir, file)
      const destFile = path.resolve(destDir, file)
      copy(srcFile, destFile)
    }
  }

  function copy(src: string, dest: string) {
    const stat = fs.statSync(src)
    if (stat.isDirectory()) {
      copyDir(src, dest)
    } else {
      fs.copyFileSync(src, dest)
    }
  }

  const write = (to: string, fileName: string, content?: any) => {
    const targetPath = RENAMABLE_FILES_MAP[fileName]
      ? path.join(to, RENAMABLE_FILES_MAP[fileName])
      : path.join(to, fileName)

    if (content) {
      fs.writeFileSync(targetPath, content)
    } else {
      console.log(to, fileName, content)
      copy(path.join(templateDir, fileName), targetPath)
    }
  }

  const files = fs.readdirSync(templateDir)
  files.filter((f) => f !== 'package.json').forEach((f) => write(root, f))

  const pkg = Object.assign(require(path.join(templateDir, `package.json`)), {
    name: result.packageName,
  })

  write(root, 'package.json', JSON.stringify(pkg, null, 2))

  const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent)
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

function isValidPackageName(name: string) {
  return /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(name)
}

function toValidPackageName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/^[._]/, '')
    .replace(/[^a-z0-9-~]+/g, '-')
}

function pkgFromUserAgent(userAgent?: string) {
  if (!userAgent) return undefined
  const pkgSpec = userAgent.split(' ')[0]
  const pkgSpecArr = pkgSpec.split('/')
  return {
    name: pkgSpecArr[0],
    version: pkgSpecArr[1],
  }
}

init().catch(({ message }) => console.log(red(message)))
