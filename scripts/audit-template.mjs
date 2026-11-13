import { spawnSync } from 'node:child_process'
import { appendFileSync, copyFileSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { TEMPLATES } from './scaffold-template.mjs'

const templateRoot = fileURLToPath(new URL('../templates/', import.meta.url))
const auditFiles = ['package.json', 'pnpm-lock.yaml', 'pnpm-workspace.yaml']
const severities = ['info', 'low', 'moderate', 'high', 'critical']

const cell = (value) => String(value ?? '—').replaceAll('|', '\\|')

export const formatAuditSummary = (template, report, gateStatus) => {
  const advisories = Object.values(report.advisories ?? {})
  const vulnerabilities = report.metadata?.vulnerabilities ?? {}
  const counts = severities
    .map((severity) => `${severity[0].toUpperCase()}${severity.slice(1)}: ${vulnerabilities[severity] ?? 0}`)
    .join(' · ')
  const outcome = gateStatus !== 0
    ? '**Action required: pnpm found a resolution for at least one advisory.**'
    : advisories.length === 0
      ? '**Clean: no unignored advisories.**'
      : '**Passing with findings: no resolution is available for the remaining advisories.**'
  const lines = [
    `## Audit: ${template}`,
    '',
    outcome,
    '',
    `Total dependencies: ${report.metadata?.totalDependencies ?? 0}  `,
    counts,
    '',
  ]

  if (advisories.length > 0) {
    lines.push(
      '| Package | Severity | Advisory | Vulnerable | Patched |',
      '| --- | --- | --- | --- | --- |',
      ...advisories.map((advisory) => {
        const id = advisory.github_advisory_id
        const link = id ? `[${id}](https://github.com/advisories/${id})` : cell(advisory.title)
        return `| ${cell(advisory.module_name)} | ${cell(advisory.severity)} | ${link} | ${cell(advisory.vulnerable_versions)} | ${cell(advisory.patched_versions)} |`
      }),
      ''
    )
  }

  return lines.join('\n')
}

const runAudit = (args, cwd, options = {}) => {
  const result = spawnSync('pnpm', ['audit', ...args], {
    cwd,
    env: { ...process.env, CI: 'true' },
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024,
    ...options,
  })

  if (result.error) throw result.error
  return result
}

export const auditTemplate = (template) => {
  if (!TEMPLATES.includes(template)) {
    throw new Error(`Unknown template: ${template}`)
  }

  const source = path.join(templateRoot, template)
  const workspace = mkdtempSync(path.join(tmpdir(), `audit-${template}-`))

  try {
    for (const file of auditFiles) {
      copyFileSync(path.join(source, file), path.join(workspace, file))
    }

    // pnpm may persist --ignore-unfixable entries, so audit only an isolated copy.
    const full = runAudit(['--json'], workspace)
    if (full.status !== 0 && full.status !== 1) {
      throw new Error(`pnpm audit failed (${full.status}):\n${full.stderr}`)
    }

    let report
    try {
      report = JSON.parse(full.stdout)
    } catch {
      throw new Error(`Unable to read pnpm audit output:\n${full.stderr || full.stdout}`)
    }

    const gate = runAudit(['--ignore-unfixable'], workspace, { stdio: 'inherit' })
    const summary = formatAuditSummary(template, report, gate.status)
    console.log(summary)

    if (process.env.GITHUB_STEP_SUMMARY) {
      appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${summary}\n`)
    }

    if (gate.status !== 0) {
      throw new Error(`Audit gate failed for ${template} (exit ${gate.status})`)
    }
  } finally {
    rmSync(workspace, { recursive: true, force: true })
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  auditTemplate(process.argv[2])
}
