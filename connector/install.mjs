import {readFile,writeFile,mkdir,copyFile,rename,access} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {randomUUID} from 'node:crypto';
import {spawnSync} from 'node:child_process';
const here=path.dirname(fileURLToPath(import.meta.url));
const target=process.argv[2];
if(!target){console.error('Chạy: node install.mjs "đường dẫn thư mục TechPath có server.mjs"');process.exit(1);}
const root=path.resolve(target);
const importLine="import {NHIP_INSTRUCTIONS,nhipContext} from './nhip-prompts.mjs';\n";
function replaceRequired(text, before, after, file){
  if(text.includes(after))return text;
  if(!text.includes(before))throw new Error(`${file} đã đổi cấu trúc; chưa sửa file nào. Cần kiểm tra bản TechPath này trước.`);
  return text.replaceAll(before,after);
}
const originals=new Map(),planned=new Map();
try{originals.set('provider-catalog.mjs',await readFile(path.join(root,'provider-catalog.mjs'),'utf8'));}catch(error){if(error.code!=='ENOENT')throw error;}
for(const name of ['server.mjs','local-codex.mjs','router-ai.mjs','local-ai.mjs'])originals.set(name,await readFile(path.join(root,name),'utf8'));
for(const name of ['local-codex.mjs','router-ai.mjs','local-ai.mjs']){
  let text=originals.get(name);
  if(!text.includes("from './nhip-prompts.mjs'")){
    text=importLine+text;
  }
    text=replaceRequired(text,"request.conversationScope==='personal'?personalContext(request):sharedContext(request)","request.conversationScope==='nhip'?nhipContext(request):request.conversationScope==='personal'?personalContext(request):sharedContext(request)",name);
    if(name==='local-codex.mjs')text=replaceRequired(text,"baseInstructions:request.conversationScope==='personal'?PERSONAL_INSTRUCTIONS:TUTOR_INSTRUCTIONS","baseInstructions:request.conversationScope==='nhip'?NHIP_INSTRUCTIONS:request.conversationScope==='personal'?PERSONAL_INSTRUCTIONS:TUTOR_INSTRUCTIONS",name);
    if(name==='router-ai.mjs')text=replaceRequired(text,"content:personal?PERSONAL_INSTRUCTIONS:TUTOR_INSTRUCTIONS","content:request.conversationScope==='nhip'?NHIP_INSTRUCTIONS:personal?PERSONAL_INSTRUCTIONS:TUTOR_INSTRUCTIONS",name);
    if(name==='local-ai.mjs'){
      text=replaceRequired(text,"system_prompt:request.conversationScope==='personal'?PERSONAL_INSTRUCTIONS:LOCAL_TUTOR_INSTRUCTIONS","system_prompt:request.conversationScope==='nhip'?NHIP_INSTRUCTIONS:request.conversationScope==='personal'?PERSONAL_INSTRUCTIONS:LOCAL_TUTOR_INSTRUCTIONS",name);
      text=replaceRequired(text,"content:hasImages?PERSONAL_INSTRUCTIONS:TUTOR_INSTRUCTIONS","content:request.conversationScope==='nhip'?NHIP_INSTRUCTIONS:hasImages?PERSONAL_INSTRUCTIONS:TUTOR_INSTRUCTIONS",name);
    }
  planned.set(name,text);
}
let server=originals.get('server.mjs');
if(!server.includes("from './nhip-http.mjs'")){
  server="import {nhipRoute,closeNhip} from './nhip-http.mjs';\n"+server;
}
server=replaceRequired(server,"'https://antechpath.creamyeft24.chatgpt.site'","'https://antechpath.creamyeft24.chatgpt.site','https://nhip-time-companion-v1.creamyeft24.chatgpt.site'",'server.mjs');
if(!server.includes('if(await nhipRoute(req,res,pathname))return;')) {
  server=replaceRequired(server,"  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);","  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);\n  if(req.headers.origin==='https://nhip-time-companion-v1.creamyeft24.chatgpt.site'&&!['/api/nhip/status','/api/nhip/chat','/api/health'].includes(pathname)){res.writeHead(403);res.end('Forbidden');return;}\n  if(await nhipRoute(req,res,pathname))return;",'server.mjs');
}
server=replaceRequired(server,"closeTutor();closePersonal();process.exit(0);","closeNhip();closeTutor();closePersonal();process.exit(0);",'server.mjs');
server=server.replace("['/api/nhip/status','/api/nhip/chat','/api/health']","['/api/nhip/status','/api/nhip/chat','/api/nhip/health','/api/health']");
planned.set('server.mjs',server);
for(const name of ['nhip-http.mjs','nhip-prompts.mjs','provider-catalog.mjs'])planned.set(name,await readFile(path.join(here,name),'utf8'));
for(const [name,text] of planned){
 const check=spawnSync(process.execPath,['--input-type=module','--check'],{input:text,encoding:'utf8'});
 if(check.status!==0)throw new Error(name+' chưa qua kiểm tra cú pháp; chưa sửa file nào.');
}
const appFiles=['index.html','styles.css','workshop.css','app.js','workshop.js','ai-client.js','guide.js','guide.css'];
for(const name of appFiles)await access(path.join(here,'app',name));
const backup=path.join(root,'.techpath-local','nhip-backup');await mkdir(backup,{recursive:true});
const written=[];
try{
  for(const [name,text]of planned){
    if(originals.has(name)){
      try{await writeFile(path.join(backup,name),originals.get(name),{flag:'wx'});}catch(error){if(error.code!=='EEXIST')throw error;}
    }
    await writeFile(path.join(root,name+'.nhip-tmp'),text);
  }
  for(const name of planned.keys()){await rename(path.join(root,name+'.nhip-tmp'),path.join(root,name));written.push(name);}
  await mkdir(path.join(root,'dist','nhip'),{recursive:true});
  for(const name of appFiles)await copyFile(path.join(here,'app',name),path.join(root,'dist','nhip',name));
  const installation={app:'nhip-installation',version:2,id:randomUUID()};
  await writeFile(path.join(root,'dist','nhip','installation.json'),JSON.stringify(installation));
  await writeFile(path.join(root,'.techpath-local','nhip-installation.json'),JSON.stringify(installation));
}catch(error){
  for(const name of written)if(originals.has(name))await writeFile(path.join(root,name),originals.get(name));
  throw error;
}
console.log('Đã thêm kết nối riêng cho Nhịp và giữ bản gốc trong .techpath-local/nhip-backup.');
console.log('Bộ cài sẽ xác minh và khởi động lại riêng server TechPath để nạp phần Nhịp.');
console.log('Mở Nhịp, chọn Kết nối AI và chọn đúng provider/model bạn muốn dùng.');
console.log('Nếu trình duyệt chặn kết nối từ web: mở http://127.0.0.1:4173/nhip/index.html');
console.log('Bộ cài không gọi model, đổi model, đọc dữ liệu học hay gửi phản hồi của bạn.');
