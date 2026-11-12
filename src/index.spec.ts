import { execFileSync } from 'child_process'
import { mkdtempSync, readFileSync, rmSync, existsSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'

const ROOT = join(__dirname, '..')
const TEMPLATES = ['react', 'react-ts', 'vite-vanilla', 'koa-ts']

describe.each(TEMPLATES)('CLI scaffolding: %s', (template) => {
  let workspace: string

  beforeEach(() => {
    workspace = mkdtempSync(join(tmpdir(), `create-templates-${template}-`))
  })

  afterEach(() => {
    rmSync(workspace, { recursive: true, force: true })
  })

  it('creates the selected project with pnpm instructions', () => {
    const output = execFileSync(
      process.execPath,
      [join(ROOT, 'scripts/scaffold-template.mjs'), template, workspace],
      { encoding: 'utf8', timeout: 20_000 }
    )
    const projectDir = join(workspace, `${template}-integration`)
    const packageJson = JSON.parse(
      readFileSync(join(projectDir, 'package.json'), 'utf8')
    )
    const templatePackageJson = JSON.parse(
      readFileSync(join(ROOT, 'templates', template, 'package.json'), 'utf8')
    )

    expect(packageJson).toEqual({
      ...templatePackageJson,
      name: `${template}-integration`,
    })
    expect(existsSync(join(projectDir, '.gitignore'))).toBe(true)
    expect(existsSync(join(projectDir, 'node_modules'))).toBe(false)
    expect(existsSync(join(projectDir, 'pnpm-lock.yaml'))).toBe(true)
    expect(existsSync(join(projectDir, 'pnpm-workspace.yaml'))).toBe(true)
    if (template !== 'vite-vanilla') {
      expect(existsSync(join(projectDir, 'eslint.config.mjs'))).toBe(true)
    }
    expect(output).toContain('Scaffolding project in')
    expect(output).toContain('pnpm install')
    expect(output).toContain('pnpm run dev')
  }, 25_000)
})
