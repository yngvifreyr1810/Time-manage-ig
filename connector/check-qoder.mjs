import {mkdir,writeFile,rename} from 'node:fs/promises';
import {qoderCheckRequest} from './router-ai.mjs';
const raw=await qoderCheckRequest(null);
if(!Array.isArray(raw))throw new Error('9Router chưa trả danh mục hợp lệ; chưa đổi danh sách.');
const ids=[...new Set(raw.map(m=>typeof m==='string'?m:m?.id).filter(id=>typeof id==='string'&&/^(qd|qoder)\//.test(id)))];
if(!ids.length)throw new Error('Chưa tìm thấy Qoder trong 9Router; chưa đổi danh sách.');
console.log('Thử '+ids.length+' model Qoder, mỗi model một yêu cầu ngắn. Không tự gửi lại.');
const results=[];
for(const id of ids){
 const start=Date.now();let ok=false,reason='';
 try{ok=await qoderCheckRequest(id);}catch(error){reason=error.name==='TimeoutError'?'timeout':/^HTTP \d+$/.test(error.message)?error.message:'connection/response error';}
 results.push({id,ok,reason,durationMs:Date.now()-start});
 console.log(id+': '+(ok?'PASS':'FAIL · '+reason));
}
if(!results.some(r=>r.ok))throw new Error('Tất cả đều lỗi: có thể do kết nối/xác thực. Giữ nguyên danh sách; chưa đủ bằng chứng để loại toàn bộ.');
const directory=new URL('./.techpath-local/',import.meta.url);await mkdir(directory,{recursive:true});
const target=new URL('qoder-model-health.json',directory),temp=new URL('qoder-model-health.tmp',directory);
await writeFile(temp,JSON.stringify({version:1,testedAt:new Date().toISOString(),results},null,2));await rename(temp,target);
console.log('Đã lưu kết quả trên máy. Làm mới danh sách model trong cả hai app; chỉ giữ Qoder PASS. Chạy lại kiểm tra để thử các model đã ẩn.');
