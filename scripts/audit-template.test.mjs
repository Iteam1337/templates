import assert from 'node:assert/strict'
import test from 'node:test'
import { formatAuditSummary } from './audit-template.mjs'

const report = {
  metadata: {
    vulnerabilities: { info: 0, low: 0, moderate: 1, high: 0, critical: 0 },
    totalDependencies: 42,
  },
  advisories: {
    1: {
      module_name: 'example',
      severity: 'moderate',
      github_advisory_id: 'GHSA-xxxx-yyyy-zzzz',
      title: 'Example advisory',
      vulnerable_versions: '<2.0.0',
      patched_versions: '>=2.0.0',
    },
  },
}

test('reports vulnerability totals and advisory details', () => {
  const summary = formatAuditSummary('react', report, 1)

  assert.match(summary, /Action required: pnpm found a resolution/)
  assert.match(summary, /Total dependencies: 42/)
  assert.match(summary, /Moderate: 1/)
  assert.match(summary, /GHSA-xxxx-yyyy-zzzz/)
  assert.match(summary, />=2\.0\.0/)
})

test('distinguishes clean and tolerated audit results', () => {
  const clean = formatAuditSummary(
    'vite-vanilla',
    { metadata: { vulnerabilities: {}, totalDependencies: 3 } },
    0
  )
  const tolerated = formatAuditSummary('react', report, 0)

  assert.match(clean, /Clean: no unignored advisories/)
  assert.match(tolerated, /Passing with findings: no resolution is available/)
})
