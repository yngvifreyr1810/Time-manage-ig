import test from 'node:test';
import assert from 'node:assert/strict';
import {verifyOwner} from '../connector/restart.mjs';

const owned=()=>({health:{app:'techpath',protocol:1,pid:1234},installation:{app:'nhip-installation',id:'installation-a'},expectedId:'installation-a',processInfo:{ProcessId:1234,Name:'node.exe',CommandLine:'"C:\\Program Files\\nodejs\\node.exe" server.mjs'},listenerPids:[1234]});
test('hidden server can be targeted only when installation, health, process and listener agree',()=>{
  assert.equal(verifyOwner(owned()),1234);
  const absolute=owned();absolute.processInfo.CommandLine='node.exe "C:\\App Folder\\server.mjs"';assert.equal(verifyOwner(absolute),1234);
});
test('refuse mismatched folder, process, listener and invalid health instead of stopping other Node services',()=>{
  for(const alter of [
    x=>{x.installation.id='other-folder';},
    x=>{x.processInfo.CommandLine='node.exe 9router.js';},
    x=>{x.processInfo.Name='other.exe';},
    x=>{x.listenerPids=[5678];},
    x=>{x.health.app='other-app';},
    x=>{x.health.pid='1234';},
  ]){const input=owned();alter(input);assert.throws(()=>verifyOwner(input));}
});
