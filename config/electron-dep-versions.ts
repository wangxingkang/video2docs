import { readFileSync } from 'fs';
import releases from 'electron-releases/lite.json';

const version = readFileSync(require.resolve('electron/dist/version'), 'utf8');
const release = releases.find(r => r.version === version);

export const chrome = release.deps.chrome.split('.')[0];
export const node = release.deps.node;
