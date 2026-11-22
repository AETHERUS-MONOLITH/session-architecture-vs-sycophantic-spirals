// Negative control for tools/parity.mjs: applies small content mutations to a copy of dist/ and
// requires the parity check to FAIL for each one. Usage: node tools/parity-mutation.mjs
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const MUTATIONS = [
  { name: 'one word changed in a cost cell', file: 'costs/index.html', from: '446 · 178 · 25 · 650', to: '446 · 178 · 25 · 651' },
  { name: 'status label changed', file: 'decisions/index.html', from: '<span class="stat stat-s">open</span>', to: '<span class="stat stat-s">decided</span>' },
  { name: 'qualifier deleted in H1', file: 'hypotheses/index.html', from: ' no numeric value is set yet.', to: '' },
  { name: 'change-log entry removed', file: 'changelog/index.html', from: /<li>30 Oct: brief V0[\s\S]*?<\/li>/, to: '' },
  { name: 'stray text added outside fragments', file: 'scoring/index.html', from: '<h1 class="page-title">', to: '<p>Results: confirmed.</p><h1 class="page-title">' },
  { name: 'internal link retargeted', file: 'handoffs/index.html', from: 'scoring/#scoring"', to: 'costs/#costs"' },
  { name: 'grid button id changed', file: 'grid/index.html', from: 'id="g-C3-5"', to: 'id="g-C3-x"' },
  { name: 'table row removed', file: 'operations/index.html', from: /<tr><td>User memory<\/td>[\s\S]*?<\/tr>/, to: '' },
];
let failed = 0;
for (const m of MUTATIONS) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'parity-mut-'));
  fs.cpSync(path.join(root, 'dist'), tmp, { recursive: true });
  const f = path.join(tmp, m.file);
  const before = fs.readFileSync(f, 'utf8');
  const after = before.replace(m.from, m.to);
  if (after === before) { console.log(`SETUP ERROR (pattern not found): ${m.name}`); failed++; continue; }
  fs.writeFileSync(f, after);
  const r = spawnSync('node', [path.join(root, 'tools/parity.mjs'), '--dist', tmp, '--out', path.join(tmp, '_report')], { encoding: 'utf8' });
  const detected = r.status !== 0;
  console.log(`${detected ? 'detected' : 'MISSED  '}  ${m.name}: ${r.stdout.split('\n')[0]}`);
  if (!detected) failed++;
  fs.rmSync(tmp, { recursive: true, force: true });
}
console.log(failed ? `${failed} mutation(s) not detected` : `all ${MUTATIONS.length} mutations detected`);
process.exit(failed ? 1 : 0);
