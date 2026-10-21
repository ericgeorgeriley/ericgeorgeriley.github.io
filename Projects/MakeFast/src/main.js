import { MF } from './bootstrap.js';
// Expose a namespaced read-only diagnostic entrypoint for browser smoke tests.
window.__MakeFastModules = Object.freeze({version: '0.41.7', get state(){return MF.state}, get minigame(){return MF.minigame}, get available(){return Object.keys(MF).length}});
