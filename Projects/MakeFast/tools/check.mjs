import fs from 'node:fs';import path from 'node:path';import { execFileSync } from 'node:child_process';
function scan(d){for(const f of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,f.name);if(f.isDirectory())scan(p);else if(p.endsWith('.js'))execFileSync(process.execPath,['--check',p])}}scan(new URL('../src',import.meta.url).pathname);console.log('All JS syntax checks passed.');
