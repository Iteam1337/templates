import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { TEMPLATE_VARIANTS } from '../src/templates.ts'

export const TEMPLATES = TEMPLATE_VARIANTS.map(({ name }) => name)

const repositoryRoot = fileURLToPath(new URL('..', import.meta.url))

export const scaffoldTemplate = (template, workspace) =>
  new Promise((resolve, reject) => {
    const templateIndex = TEMPLATES.indexOf(template)

    if (templateIndex === -1) {
      reject(new Error(`Unknown template: ${template}`))
      return
    }

    const projectName = `${template}-integration`
    const projectDir = path.join(workspace, projectName)
    const cli = spawn(process.execPath, [path.join(repositoryRoot, 'index.js')], {
      cwd: workspace,
      env: { ...process.env, FORCE_COLOR: '0', npm_config_user_agent: 'pnpm' },
      stdio: ['pipe', 'pipe', 'pipe'],
    })
    let output = ''
    let answeredName = false
    let answeredTemplate = false

    const timeout = setTimeout(() => {
      cli.kill('SIGKILL')
      reject(new Error(`Timed out scaffolding ${template}:\n${output}`))
    }, 15_000)

    cli.stdout.on('data', (chunk) => {
      output += chunk

      if (!answeredName && output.includes('Project name:')) {
        answeredName = true
        cli.stdin.write(`${projectName}\n`)
      }

      if (!answeredTemplate && output.includes('Select a template:')) {
        answeredTemplate = true
        cli.stdin.end(`${'\u001b[B'.repeat(templateIndex)}\r`)
      }
    })
    cli.stderr.on('data', (chunk) => {
      output += chunk
    })
    cli.on('error', reject)
    cli.on('close', (code) => {
      clearTimeout(timeout)

      if (code !== 0 || !existsSync(path.join(projectDir, 'package.json'))) {
        reject(new Error(`Failed to scaffold ${template} (exit ${code}):\n${output}`))
        return
      }

      resolve({ output, projectDir, projectName })
    })
  })

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [template, workspace] = process.argv.slice(2)
  const result = await scaffoldTemplate(template, workspace)
  console.log(result.output)
}