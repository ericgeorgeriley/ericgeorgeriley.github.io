import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, readdirSync} from 'node:fs';
const bootstrap=readFileSync(new URL('../src/bootstrap.js',import.meta.url),'utf8');
test('bootstrap registers declarations before source-order initializers',()=>{
  assert(bootstrap.indexOf('M0.install()')<bootstrap.indexOf('M0.init_'));
});
test('HTML uses native ES modules and extracted stylesheet links',()=>{
  const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
  assert.match(html,/type="module"/);
  assert.doesNotMatch(html,/<script>\s*\(\(\)=>/);
  assert.match(html,/styles\/arcade\.css/);
});
test('minigames and sprites have independent source files',()=>{
  assert(readFileSync(new URL('../src/arcade/games/cattleships.js',import.meta.url),'utf8').includes('arcadeCattlePlayerPlace'));
  assert(readFileSync(new URL('../src/arcade/games/seabed-cipher.js',import.meta.url),'utf8').includes('arcadeCipherEvaluate'));
  assert(readFileSync(new URL('../src/render/sprites/residents.js',import.meta.url),'utf8').includes('residentSprite'));
});
