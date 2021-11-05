#!/usr/bin/env node

import { loadEnv } from 'vite';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

/**
 * @param {string[]} modes
 * @param {string} filePath
 */
function buildMode(modes: string[], filePath: string) {
  const interfaces = modes.map(mode => {
    const name = `${mode}Env`;
    const envs = {
      MODE: mode,
      PROD: mode === 'production',
      DEV: mode !== 'production',
      ...loadEnv(mode, process.cwd(), ''),
    };

    const interfaceDeclaration = `interface ${name} ${JSON.stringify(envs)}`;

    return {name, interfaceDeclaration};
  });

  const str = interfaces.map(({interfaceDeclaration}) => interfaceDeclaration).join('\n');
  const name = interfaces.map(({name}) => name).join(' | ');

  writeFileSync(filePath, `${str}\nexport type ImportMetaEnv = ${name}\n`, {encoding: 'utf-8'});
}

buildMode(['production', 'development', 'test'], resolve(process.cwd(), './types/env.d.ts'));


