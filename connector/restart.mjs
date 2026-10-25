import {readFile,access} from 'node:fs/promises';
import path from 'node:path';
import {spawn,execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {pathToFileURL} from 'node:url';

const execFileAsync=promisify(execFile);
const base='http://127.0.0.1:4173';
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function readJSON(url){const response=await fetch(url,{signal:AbortSignal.timeout(2500),redirect:'error'});if(!response.ok)throw new Error('HTTP '+response.status);return response.json();}

export function verifyOwner({health,installation,expectedId,processInfo,listenerPids}){
  if(health?.app!=='techpath'||health.protocol!==1||!Number.isSafeInteger(health.pid)||health.pid<=0)throw new Error('Cổng 4173 không xác nhận là server TechPath. Chưa dừng tiến trình nào.');
  if(installation?.app!=='nhip-installation'||!expectedId||installation.id!==expectedId)throw new Error('Server đang chạy từ thư mục TechPath khác thư mục bạn đã chọn. Chưa dừng tiến trình nào.');
  if(Number(processInfo?.ProcessId)!==health.pid||!/^node(?:\.exe)?$/i.test(processInfo?.Name||'')||!/(?:^|[\\/\s"'])server\.mjs(?:[\s"']|$)/i.test(processInfo?.CommandLine||''))throw new Error('Tiến trình đang giữ cổng chưa xác nhận là Node chạy server.mjs của TechPath. Chưa dừng tiến trình nào.');
  if(!Array.isArray(listenerPids)||!listenerPids.map(Number).includes(health.pid))throw new Error('PID từ trạng thái TechPath không khớp tiến trình giữ cổng. Chưa dừng tiến trình nào.');
  return health.pid;
}

export async function restart(root){
  if(process.platform!=='win32')throw new Error('Thao tác khởi động lại này chỉ chạy trên máy Windows có TechPath.');
  root=path.resolve(root);
  await access(path.join(root,'Start-TechPath.ps1'));
  const source=await readFile(path.join(root,'server.mjs'),'utf8');
  if(!source.includes('nhipRoute(req,res,pathname)'))throw new Error('Thư mục này chưa có route Nhịp. Chạy lại bộ cài đầy đủ trước.');
  const expected=JSON.parse(await readFile(path.join(root,'.techpath-local','nhip-installation.json'),'utf8'));
  let health=null;
  try{health=await readJSON(base+'/api/health');}catch{}
  if(health){
    let installation;
    try{installation=await readJSON(base+'/nhip/installation.json');}
    catch{throw new Error('Server 4173 chưa đọc được dấu nhận diện từ thư mục bạn chọn. Có thể TechPath đang chạy từ thư mục khác; chưa dừng tiến trình nào.');}
    const query=`$p=Get-CimInstance Win32_Process -Filter 'ProcessId = ${Number.isSafeInteger(health.pid)?health.pid:0}';$l=@(Get-NetTCPConnection -LocalPort 4173 -State Listen -ErrorAction SilentlyContinue|Select-Object -ExpandProperty OwningProcess -Unique);@{processInfo=@{ProcessId=$p.ProcessId;Name=$p.Name;CommandLine=$p.CommandLine};listenerPids=$l}|ConvertTo-Json -Compress -Depth 3`;
    const result=await execFileAsync('powershell.exe',['-NoProfile','-Command',query],{windowsHide:true,timeout:10000});
    const info=JSON.parse(result.stdout.replace(/^\uFEFF/,''));
    const pid=verifyOwner({health,installation,expectedId:expected.id,...info});
    if(pid===process.pid)throw new Error('Không dừng chính bộ cài.');
    console.log('Đã xác nhận đúng server TechPath của thư mục được chọn. Đang nạp lại...');
    process.kill(pid,'SIGTERM');
    let stopped=false;
    for(let attempt=0;attempt<25;attempt++){
      try{process.kill(pid,0);}catch{stopped=true;break;}
      await wait(200);
    }
    if(!stopped)throw new Error('Server cũ chưa dừng. Chưa mở thêm server trùng cổng.');
  }
  await new Promise((resolve,reject)=>{
    const child=spawn('powershell.exe',['-NoProfile','-ExecutionPolicy','Bypass','-File',path.join(root,'Start-TechPath.ps1'),'-NoOpen'],{cwd:root,stdio:'inherit'});
    child.on('error',reject);child.on('exit',code=>code===0?resolve():reject(new Error('TechPath chưa khởi động được. Xem thông báo ngay phía trên.')));
  });
  const ready=await readJSON(base+'/api/nhip/health');
  if(ready.app!=='nhip'||ready.protocol!==1||ready.version!==2)throw new Error('Server đã mở nhưng chưa xác minh được phiên bản kết nối Nhịp.');
  console.log('THÀNH CÔNG: server đã nạp kết nối Nhịp. Không gọi model trong bước kiểm tra.');
  console.log('Quay lại Nhịp, bấm Kiểm tra kết nối và chọn nguồn/model bạn muốn dùng.');
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){
  restart(process.argv[2]||'').catch(error=>{console.error(error.message);process.exitCode=1;});
}
