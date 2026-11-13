import { spawn, spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import http from 'node:http'
import net from 'node:net'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { scaffoldTemplate, TEMPLATES } from './scaffold-template.mjs'

const run = (command, args, cwd) => {
  const result = spawnSync(command, args, {
    cwd,
    env: { ...process.env, CI: 'true' },
    stdio: 'inherit',
  })

  if (result.error) throw result.error
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} exited with ${result.status}`)
  }
}

const getAvailablePort = () =>
  new Promise((resolve, reject) => {
    const listener = net.createServer()
    listener.unref()
    listener.on('error', reject)
    listener.listen(0, '127.0.0.1', () => {
      const { port } = listener.address()
      listener.close(() => resolve(port))
    })
  })

const request = (port) =>
  new Promise((resolve, reject) => {
    const req = http.get(
      { hostname: '127.0.0.1', port, path: '/', timeout: 1_000 },
      (res) => {
        res.resume()
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 400) {
            resolve()
          } else {
            reject(new Error(`HTTP ${res.statusCode}`))
          }
        })
      }
    )
    req.on('timeout', () => req.destroy(new Error('Request timed out')))
    req.on('error', reject)
  })

const stop = async (server) => {
  if (server.exitCode !== null || server.signalCode !== null) return

  try {
    process.kill(-server.pid, 'SIGTERM')
  } catch {
    server.kill('SIGTERM')
  }

  await Promise.race([
    new Promise((resolve) => server.once('close', resolve)),
    new Promise((resolve) => setTimeout(resolve, 5_000)),
  ])

  if (server.exitCode === null && server.signalCode === null) {
    try {
      process.kill(-server.pid, 'SIGKILL')
    } catch {
      server.kill('SIGKILL')
    }
  }
}

const verify = async (template) => {
  const workspace = mkdtempSync(path.join(tmpdir(), `template-${template}-`))
  let server

  try {
    const { projectDir } = await scaffoldTemplate(template, workspace)
    console.log(`\nInstalling ${template} with pnpm...`)
    run('pnpm', ['install', '--frozen-lockfile'], projectDir)

    const packageJson = JSON.parse(
      readFileSync(path.join(projectDir, 'package.json'), 'utf8')
    )

    if (packageJson.scripts.build) {
      console.log(`\nBuilding ${template}...`)
      run('pnpm', ['build'], projectDir)
    }

    if (packageJson.scripts.test) {
      console.log(`\nTesting ${template}...`)
      run('pnpm', ['test'], projectDir)
    }

    if (packageJson.scripts.lint) {
      console.log(`\nLinting ${template}...`)
      run('pnpm', ['lint'], projectDir)
    }

    const port = await getAvailablePort()
    const args =
      template === 'koa-ts'
        ? ['start']
        : ['dev', '--host', '127.0.0.1', '--port', String(port), '--strictPort']

    console.log(`\nBooting ${template} on port ${port}...`)
    server = spawn('pnpm', args, {
      cwd: projectDir,
      detached: true,
      env: { ...process.env, PORT: String(port) },
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    let serverOutput = ''
    server.stdout.on('data', (chunk) => (serverOutput += chunk))
    server.stderr.on('data', (chunk) => (serverOutput += chunk))

    const deadline = Date.now() + 60_000
    let booted = false
    let lastError

    while (Date.now() < deadline && !booted) {
      if (server.exitCode !== null || server.signalCode !== null) {
        throw new Error(`${template} exited before booting:\n${serverOutput}`)
      }

      try {
        await request(port)
        booted = true
      } catch (error) {
        lastError = error
        await new Promise((resolve) => setTimeout(resolve, 250))
      }
    }

    if (!booted) {
      throw new Error(
        `${template} did not respond within 60 seconds: ${lastError}\n${serverOutput}`
      )
    }

    console.log(`${template} booted successfully.`)
  } finally {
    if (server) await stop(server)
    rmSync(workspace, { recursive: true, force: true })
  }
}

const template = process.argv[2]

if (!TEMPLATES.includes(template)) {
  console.error(`Usage: pnpm test:template <${TEMPLATES.join('|')}>`)
  process.exitCode = 1
} else {
  await verify(template)
}