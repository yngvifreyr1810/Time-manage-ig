import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,copyFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import http from 'node:http';

test('Nhịp transport is explicit, scoped, bounded and cancellable without model calls',async t=>{
  const dir=await mkdtemp(path.join(tmpdir(),'nhip-route-check-'));
  await copyFile(new URL('../connector/nhip-http.mjs',import.meta.url),path.join(dir,'nhip-http.mjs'));
  const files={
    'session-access.mjs':"export const sessionToken='test-only-token';",
    'state.mjs':`export const state={calls:[],cancelled:0};
      export async function review(request,emit,signal){state.calls.push(request);if(request.prompt==='wait')await new Promise((resolve,reject)=>{const timer=setTimeout(resolve,10000);signal.addEventListener('abort',()=>{clearTimeout(timer);state.cancelled++;reject(new Error('cancelled'));},{once:true});});emit({type:'done',text:'Test response',model:request.model});}`,
    'local-codex.mjs':"import{review}from'./state.mjs';export class LocalCodex{async status(){return{connected:true,model:'test-model'};}async review(...args){return review(...args);}close(){}}",
    'router-ai.mjs':"import{review}from'./state.mjs';export async function routerStatus(){return{connected:true,models:[{id:'test-model'}]};}export const routerReview=review;",
    'local-ai.mjs':"import{review}from'./state.mjs';export async function localStatus(){return{connected:true,models:[{id:'local-ai'}]};}export const localReview=review;",
  };
  for(const[name,content]of Object.entries(files))await writeFile(path.join(dir,name),content);
  const {nhipRoute}=await import(pathToFileURL(path.join(dir,'nhip-http.mjs')));
  const {state}=await import(pathToFileURL(path.join(dir,'state.mjs')));
  const server=http.createServer(async(req,res)=>{if(!await nhipRoute(req,res,new URL(req.url,'http://localhost').pathname)){res.writeHead(404);res.end();}});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const base='http://127.0.0.1:'+server.address().port;
  t.after(async()=>{server.closeAllConnections();await new Promise(resolve=>server.close(resolve));await rm(dir,{recursive:true,force:true});});
  const payload={provider:'codex',model:'test-model',mode:'guide',prompt:'One step',context:{task:{id:'test',title:'Example'}},history:[]};
  const post=(body,token='test-only-token',signal)=>fetch(base+'/api/nhip/chat',{method:'POST',headers:{'Content-Type':'application/json','X-TechPath-Token':token},body:JSON.stringify(body),signal});
  const until=async condition=>{const deadline=Date.now()+1500;while(!condition()){assert.ok(Date.now()<deadline,'local test condition timed out');await new Promise(resolve=>setTimeout(resolve,5));}};
  const status=await(await fetch(base+'/api/nhip/status?provider=codex')).json();
  assert.equal(status.connected,true);assert.equal(state.calls.length,0);
  const health=await(await fetch(base+'/api/nhip/health')).json();
  assert.equal(health.app,'nhip');assert.equal(health.version,2);assert.equal(state.calls.length,0);
  assert.equal((await post(payload,'wrong')).status,403);
  assert.equal((await post({...payload,mode:'invalid'})).status,400);
  assert.equal((await post({...payload,context:{data:'x'.repeat(12500)}})).status,413);
  assert.equal(state.calls.length,0);
  const response=await post({...payload,history:Array.from({length:10},()=>({role:'user',text:'x'.repeat(2000)}))});
  assert.equal(response.status,200);assert.match(await response.text(),/Test response/);
  assert.equal(state.calls[0].conversationScope,'nhip');
  assert.equal(state.calls[0].context.task.id,'test');
  assert.equal(state.calls[0].history.length,6);assert.equal(state.calls[0].history[0].text.length,1500);
  const controller=new AbortController();
  const waiting=post({...payload,prompt:'wait'},'test-only-token',controller.signal).catch(error=>error);
  await until(()=>state.calls.length>=2);
  assert.equal((await post(payload)).status,409);
  controller.abort();await waiting;
  await until(()=>state.cancelled>=1);
  assert.equal(state.calls.length,2);
});
