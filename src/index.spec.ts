import { join } from 'path'
import { execSync } from 'child_process'

const CLI_PATH = join(__dirname, '..')

const run = (cmd: string = `node ${CLI_PATH}`) => execSync(cmd).toString()

describe('test', () => {
  it('works', () => {
    const result = run()
    expect(result).toContain('Project name:')
  })
})
