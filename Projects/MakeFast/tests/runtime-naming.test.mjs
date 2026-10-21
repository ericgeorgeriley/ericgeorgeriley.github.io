import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
function files(dir){return readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(join(dir,e.name)):e.name.endsWith('.js')?[join(dir,e.name)]:[])}
test('runtime APIs never reintroduce feature version suffixes',()=>{
 const invalid=[];const re=/\bMF\.(?:mfV\d+[A-Za-z_]*|mf(?:38|39|40)[A-Z]\w*|MF_V\d+_\w+|MF(?:38|39|40)_\w+)/g;
 for(const f of files(new URL('../src/',import.meta.url).pathname))for(const match of readFileSync(f,'utf8').matchAll(re))invalid.push(`${f}: ${match[0]}`);
 assert.deepEqual(invalid,[]);
});
