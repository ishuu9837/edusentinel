// Reversible migration for uploads merged over the previous app folder.
import { readFile, rename, mkdir, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const exists = async path => { try { await access(path); return true; } catch { return false; } };
const page = await readFile(resolve(root, 'src/app/page.tsx'), 'utf8');
if (!page.includes('Edusentinel')) throw new Error('Missing the new Edusentinel src/app/page.tsx. Upload the complete replacement folder.');

const legacy = ['app', 'components/LearningObservatory.tsx', 'lib/parseFeatures.ts'];
let backup;
for (const relative of legacy) {
 const source = resolve(root, relative);
 if (!await exists(source)) continue;
 if (!backup) {
  backup = resolve(root, '.legacy-app-backup', String(Date.now()));
  await mkdir(backup, {recursive:true});
 }
 const destination = resolve(backup, relative);
 await mkdir(resolve(destination, '..'), {recursive:true});
 await rename(source, destination);
 console.log(`Preserved obsolete ${relative} in .legacy-app-backup; using src/app.`);
}
