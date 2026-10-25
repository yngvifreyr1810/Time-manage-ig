import {LocalCodex} from './local-codex.mjs';
import {routerStatus,routerReview} from './router-ai.mjs';
import {localStatus,localReview} from './local-ai.mjs';
import {sessionToken} from './session-access.mjs';
import {fileURLToPath} from 'node:url';
const codex = new LocalCodex(fileURLToPath(new URL('./.techpath-local/nhip/', import.meta.url)));
let busy = false;
const pickText = (value, size) => typeof value === 'string' ? value.slice(0, size) : '';
export async function nhipRoute(req, res, pathname) {
  if (!pathname.startsWith('/api/nhip/')) return false;
  const json = (status, body) => { res.writeHead(status, {'Content-Type':'application/json','Cache-Control':'no-store'}); res.end(JSON.stringify(body)); };
  try {
    if (pathname === '/api/nhip/health' && req.method === 'GET') {
      json(200,{app:'nhip',protocol:1,version:2,pid:process.pid,busy});return true;
    }
    if (pathname === '/api/nhip/status' && req.method === 'GET') {
      const provider = new URL(req.url,'http://localhost').searchParams.get('provider');
      if (!['codex','router','local'].includes(provider)) { json(400,{error:'Chọn một kết nối trước khi kiểm tra.'}); return true; }
      const result = provider === 'codex' ? await codex.status() : provider === 'router' ? await routerStatus() : await localStatus();
      const models = provider === 'codex' ? (result.connected ? [{id:result.model,label:'Codex · '+result.model}] : []) : result.models || [];
      json(200,{app:'nhip',protocol:1,token:sessionToken,provider,connected:!!result.connected,models,message:result.message || 'Đã đọc trạng thái kết nối.'});
      return true;
    }
    if (pathname !== '/api/nhip/chat' || req.method !== 'POST') { json(404,{error:'Không có thao tác này.'}); return true; }
    if (req.headers['x-techpath-token'] !== sessionToken) { json(403,{error:'Kết nối hết hạn. Hãy kết nối lại; yêu cầu chưa được tự gửi lại.'}); return true; }
    if (!req.headers['content-type']?.startsWith('application/json')) { json(415,{error:'Cần dữ liệu JSON.'}); return true; }
    let raw='';
    for await (const chunk of req) { raw += chunk; if (Buffer.byteLength(raw)>42000) { json(413,{error:'Giữ lại phần trao đổi liên quan để tiết kiệm ngữ cảnh.'}); return true; } }
    let body; try { body=JSON.parse(raw); } catch { json(400,{error:'Dữ liệu gửi không hợp lệ.'}); return true; }
    if (!['codex','router','local'].includes(body.provider) || !['intro','guide','feedback','chat'].includes(body.mode) || typeof body.prompt!=='string' || !body.prompt.trim() || body.prompt.length>4000 || typeof body.model!=='string' || !body.model || body.model.length>200) { json(400,{error:'Chọn model và nhập nội dung trước khi gửi.'}); return true; }
    const context=body.context && typeof body.context==='object' && !Array.isArray(body.context) ? body.context : {};
    if (JSON.stringify(context).length>12000) { json(413,{error:'Ngữ cảnh quá dài. Chỉ gửi nhiệm vụ và phản hồi liên quan.'}); return true; }
    const history=(Array.isArray(body.history)?body.history:[]).filter(m=>m&&['user','assistant'].includes(m.role)&&typeof m.text==='string').slice(-6).map(m=>({role:m.role,text:pickText(m.text,1500)}));
    if (busy) { json(409,{error:'Đang trả lời một lượt của Nhịp. Chờ xong hoặc bấm Dừng.'}); return true; }
    busy=true;
    res.writeHead(200,{'Content-Type':'application/x-ndjson; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
    const controller=new AbortController(); res.on('close',()=>controller.abort());
    const emit=event=>{if(!res.destroyed)res.write(JSON.stringify(event)+'\n');};
    const request={prompt:body.prompt.trim(),mode:body.mode,context,history,conversationScope:'nhip',clientId:'nhip',lessonId:'nhip-activity',provider:body.provider,model:body.model,grading:null};
    try { if(body.provider==='codex')await codex.review(request,emit,controller.signal);else if(body.provider==='router')await routerReview(request,emit,controller.signal);else await localReview(request,emit,controller.signal); }
    catch(error){emit({type:'error',text:error.message});}
    finally {busy=false;res.end();}
  } catch(error) { if(!res.headersSent)json(503,{error:error.message});else res.end(); }
  return true;
}
export function closeNhip(){codex.close();}
