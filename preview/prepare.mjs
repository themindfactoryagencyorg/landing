import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const root = path.resolve(import.meta.dirname, '..');
const destination = process.argv[2];
assert.ok(destination && path.isAbsolute(destination), 'Provide a new absolute output directory.');
assert.ok(!existsSync(destination), 'Preserve existing snapshots; choose a new output directory.');
const prefix = '/d/landing-preview';
const files = execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean);
const publicFiles = files.filter(file => /^(assets|js)\//.test(file) || /^[^/]+\.(html|css)$/.test(file));
assert.equal(execFileSync('git', ['diff', 'HEAD', '--name-only', '--', ...publicFiles], { cwd: root, encoding: 'utf8' }).trim(), '', 'Commit public-file changes before making a versioned snapshot.');

for (const file of publicFiles) {
  const target = path.join(destination, file);
  mkdirSync(path.dirname(target), { recursive: true });
  let bytes = readFileSync(path.join(root, file));
  if (/\.(html|css)$/.test(file)) {
    let text = bytes.toString('utf8').replace(/(["'(])\/(?!\/)/g, `$1${prefix}/`);
    if (file.endsWith('.html')) text = text.replace('<head>', '<head>\n<meta name="robots" content="noindex, nofollow">');
    bytes = Buffer.from(text);
  }
  writeFileSync(target, bytes);
}
writeFileSync(path.join(destination, 'robots.txt'), 'User-agent: *\nDisallow: /\n');

for (const file of publicFiles.filter(file => file.endsWith('.html'))) {
  const html = readFileSync(path.join(destination, file), 'utf8');
  assert.ok(html.includes('noindex, nofollow'), file);
  for (const [, resource] of html.matchAll(/(?:src|href)="(\/[^"?#]*)(?:[?#][^"]*)?"/g)) {
    assert.ok(resource.startsWith(`${prefix}/`), `Ungated resource: ${resource}`);
    assert.ok(existsSync(path.join(destination, resource.slice(prefix.length))), `Missing resource: ${resource}`);
  }
}
assert.ok(readFileSync(path.join(destination, 'styles.css'), 'utf8').includes(`${prefix}/assets/team/patio-common.webp`));
for (const file of publicFiles.filter(file => file.endsWith('.js'))) {
  assert.deepEqual(readFileSync(path.join(destination, file)), readFileSync(path.join(root, file)), `JavaScript changed: ${file}`);
  execFileSync(process.execPath, ['--check', path.join(destination, file)]);
}
console.log(JSON.stringify({ source_commit: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(), prefix, files: publicFiles.length + 1, destination }));
