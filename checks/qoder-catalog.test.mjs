import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,copyFile,mkdir,writeFile,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {spawnSync} from 'node:child_process';

test('Qoder names, Copilot removal and explicit local check results control visibility',async()=>{
 const dir=await mkdtemp(path.join(tmpdir(),'qoder-catalog-'));
 try{
  await copyFile(new URL('../connector/provider-catalog.mjs',import.meta.url),path.join(dir,'provider-catalog.mjs'));
  await copyFile(new URL('../connector/check-qoder.mjs',import.meta.url),path.join(dir,'check-qoder.mjs'));
  const raw=[{id:'gh/auto'},{id:'gh/pinned'},{id:'qd/qmodel_38max'},{id:'qd/dfmodel'},{id:'cx/existing'}];
  const {catalogModels}=await import(pathToFileURL(path.join(dir,'provider-catalog.mjs')));
  assert.deepEqual(catalogModels(raw).map(m=>m.label),['Qwen3.8-Max','DeepSeek-V4-Flash','cx/existing']);
  const stub=`export async function qoderCheckRequest(id){if(id===null)return ${JSON.stringify(raw)};if(id==='qd/dfmodel')throw Error('HTTP 403');return true;}`;
  await writeFile(path.join(dir,'router-ai.mjs'),stub);
  let result=spawnSync(process.execPath,[path.join(dir,'check-qoder.mjs')],{encoding:'utf8'});
  assert.equal(result.status,0,result.stderr);
  assert.deepEqual(catalogModels(raw).map(m=>m.id),['qd/qmodel_38max','cx/existing']);
  const report=path.join(dir,'.techpath-local/qoder-model-health.json'),before=await readFile(report,'utf8');
  await writeFile(path.join(dir,'router-ai.mjs'),`export async function qoderCheckRequest(id){if(id===null)return ${JSON.stringify(raw)};throw Error('HTTP 401');}`);
  result=spawnSync(process.execPath,[path.join(dir,'check-qoder.mjs')],{encoding:'utf8'});
  assert.notEqual(result.status,0);assert.equal(await readFile(report,'utf8'),before);
 }finally{await rm(dir,{recursive:true,force:true});}
});
