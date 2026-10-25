/* Explicit local-model transport and browser-local evidence. No provider tokens are persisted. */
(() => {
  'use strict';
  state.aiConfig = state.aiConfig && typeof state.aiConfig === 'object' ? state.aiConfig : {};
  state.aiEvents = Array.isArray(state.aiEvents) ? state.aiEvents : [];
  state.aiAnnotations = Array.isArray(state.aiAnnotations) ? state.aiAnnotations : [];
  state.aiMemory = Array.isArray(state.aiMemory) ? state.aiMemory : [];
  state.aiModels = state.aiModels && typeof state.aiModels === 'object' ? state.aiModels : {};
  state.aiUserContext = typeof state.aiUserContext === 'string' ? state.aiUserContext : '';
  for (const event of state.aiEvents) if (event.status === 'pending') event.status = 'interrupted';
  let token=null,connected=false,busy=false,controller=null,statusProvider=null;
  let checking=false,checkEpoch=0,statusController=null;
  const loopback=['127.0.0.1','localhost'].includes(location.hostname);
  const defaultBase=loopback?location.origin:'http://127.0.0.1:4173';
  const statusText=$('#ai-status-text');
  const errorText=error=>error.name==='AbortError'?'Đã dừng. Lượt này không tự gửi lại.':error.message||'Chưa kết nối được AI.';
  function connectionMessage(text,stateName='idle',detail=''){
    $('#ai-connection-message').textContent=text;$('#ai-connection-message').dataset.state=stateName;$('#ai-connection-message').title=detail||text;
  }
  function updateStatus(){
    statusText.textContent=busy?'AI đang trả lời':connected?'AI đã kết nối':'Kết nối AI';
    $('#ai-connect').dataset.connected=String(connected);
    $('#ai-provider').disabled=busy;$('#ai-model').disabled=busy||checking;$('#ai-base').disabled=busy;$('#ai-check').disabled=busy||checking;
    document.dispatchEvent(new CustomEvent('nhip:ai-state',{detail:{connected,busy}}));
  }
  function baseURL(){
    const url=new URL($('#ai-base').value.trim());
    if(url.protocol!=='http:'||!['127.0.0.1','localhost'].includes(url.hostname)||url.username||url.password||url.search||url.hash||url.pathname!=='/')throw new Error('Dùng địa chỉ bộ kết nối trên máy, ví dụ http://127.0.0.1:4173');
    return url.origin;
  }
  function renderModels(models,previous){
    const select=$('#ai-model');select.replaceChildren(new Option('Chọn model',''));
    const grouped=models.some(model=>typeof model.group==='string'&&model.group.trim());
    const groups=new Map();
    for(const model of models){
      const option=new Option(String(model.label||model.name||model.id).slice(0,200),model.id);
      if(!grouped){select.append(option);continue;}
      const name=String(model.group||'Model khác').trim().slice(0,80);
      if(!groups.has(name)){const group=document.createElement('optgroup');group.label=name;groups.set(name,group);select.append(group);}
      groups.get(name).append(option);
    }
    if(models.some(model=>model.id===previous))select.value=previous;
    else if($('#ai-provider').value!=='router'&&models.length===1)select.value=models[0].id;
  }
  function invalidateConnection(){
    checkEpoch++;statusController?.abort();connected=false;token=null;statusProvider=null;checking=false;
    $('#ai-model').replaceChildren(new Option('Đang chờ danh sách…',''));updateStatus();
  }
  async function checkConnection(){
    if(busy)return;
    const epoch=++checkEpoch;statusController?.abort();statusController=new AbortController();checking=true;connected=false;token=null;
    connectionMessage('Đang kiểm tra kết nối…','loading');updateStatus();
    try{
      const base=baseURL(),provider=$('#ai-provider').value;
      const response=await fetch(base+'/api/nhip/status?provider='+encodeURIComponent(provider),{credentials:'omit',redirect:'error',signal:AbortSignal.any([statusController.signal,AbortSignal.timeout(15000)])});
      if(epoch!==checkEpoch)return;
      if(!response.ok)throw new Error(response.status===404?'Server chưa nạp phần Nhịp. Mở Thiết lập nâng cao và chạy bộ sửa kết nối.':'Bộ kết nối trả HTTP '+response.status+'.');
      const result=await response.json();if(epoch!==checkEpoch)return;
      if(result.app!=='nhip'||result.protocol!==1)throw new Error('Bộ kết nối chưa tương thích với Nhịp.');
      if(!result.connected)throw new Error(result.message||'Nguồn AI chưa sẵn sàng.');
      if(typeof result.token!=='string'||!result.token)throw new Error('Bộ kết nối chưa cấp phiên hợp lệ.');
      token=result.token;statusProvider=provider;
      const models=(Array.isArray(result.models)?result.models:[]).filter(model=>model&&typeof model.id==='string'&&model.id.length<=200);
      const previous=state.aiModels[provider]||(state.aiConfig.provider===provider?state.aiConfig.model:null);
      renderModels(models,previous);connected=!!$('#ai-model').value;
      state.aiConfig={base,provider,model:$('#ai-model').value};if(connected)state.aiModels[provider]=state.aiConfig.model;save();
      connectionMessage(connected?'Đang hoạt động':models.length?'Chọn model để bắt đầu':'Nguồn này chưa có model khả dụng',connected?'connected':'idle',result.message||'');
    }catch(error){
      if(epoch!==checkEpoch)return;
      connectionMessage(error.name==='TypeError'?'Chưa truy cập được bộ kết nối. Xem Thiết lập nâng cao để kiểm tra địa chỉ hoặc dùng bản trên máy.':errorText(error),'error');
    }finally{if(epoch===checkEpoch){checking=false;updateStatus();}}
  }
  function openConnection(){
    $('#ai-connection-dialog').showModal();
    if(connected)connectionMessage('Đang hoạt động','connected');
    else if(!checking)checkConnection();
  }
  $('#ai-base').value=state.aiConfig.base||defaultBase;
  $('#ai-provider').value=['codex','router','local'].includes(state.aiConfig.provider)?state.aiConfig.provider:'codex';
  $('#ai-connect').addEventListener('click',openConnection);
  $('#ai-close-connection').addEventListener('click',()=>$('#ai-connection-dialog').close());
  for(const selector of ['#ai-base','#ai-provider'])$(selector).addEventListener('change',()=>{invalidateConnection();checkConnection();});
  $('#ai-check').addEventListener('click',checkConnection);
  $('#ai-model').addEventListener('change',()=>{
    connected=!!token&&statusProvider===$('#ai-provider').value&&!!$('#ai-model').value;
    if(connected){state.aiConfig={base:baseURL(),provider:statusProvider,model:$('#ai-model').value};state.aiModels[statusProvider]=state.aiConfig.model;save();}
    connectionMessage(connected?'Đang hoạt động':'Chọn model để bắt đầu',connected?'connected':'idle');updateStatus();
  });
  function buildContext(override){
    const base=override||window.NhipGuide?.context()||{app:'Nhịp',version:3,liveLearningProgress:false};
    const approvedMemory=state.aiMemory.filter(memory=>memory&&typeof memory.text==='string'&&(!memory.missionId||memory.missionId===base.task?.id)).slice(-4).map(memory=>({text:memory.text.slice(0,800),approved:true}));
    const result={...base,approvedMemory,...(state.aiUserContext.trim()?{userProvidedContext:{text:state.aiUserContext.trim().slice(0,1200),approved:true}}:{})};
    let limited=false;
    for(const [key,minimum]of [['recordedActivities',0],['recentConfirmedSessions',0],['confirmedSteps',1],['guideConversation',1],['approvedSessionNotes',1],['approvedMemory',1]]){
      if(!Array.isArray(result[key]))continue;
      result[key]=[...result[key]];
      while(JSON.stringify(result).length>10000&&result[key].length>minimum){result[key].shift();limited=true;}
    }
    if(limited)result.contextWindow='Một số bản ghi cũ được lược bớt để giữ nhiệm vụ, bối cảnh được duyệt và đoạn trao đổi liên quan.';
    return result;
  }
  async function send({mode='chat',prompt,history=[],context:contextOverride,onUpdate=()=>{}}) {
    if(busy)throw new Error('Đợi lượt hiện tại xong hoặc bấm Dừng trước.');
    if(!connected||!token){openConnection();throw new Error('Kết nối AI trước khi gửi. Nội dung của bạn vẫn được giữ.');}
    if(typeof prompt!=='string'||!prompt.trim()||prompt.length>4000)throw new Error('Nhập nội dung dưới 4.000 ký tự.');
    const context=buildContext(contextOverride);
    const payload={provider:state.aiConfig.provider,model:state.aiConfig.model,mode,prompt:prompt.trim(),context,history:history.filter(m=>m&&['user','assistant'].includes(m.role)&&typeof m.text==='string').slice(-6).map(m=>({role:m.role,text:m.text.slice(0,1500)}))};
    if(JSON.stringify(payload.context).length>12000)throw new Error('Ngữ cảnh hiện quá dài. Cần thu gọn phần trao đổi trước khi gửi.');
    const event={id:crypto.randomUUID(),at:new Date().toISOString(),mode,provider:payload.provider,model:payload.model,context:payload.context,input:payload.prompt,output:'',status:'pending'};
    state.aiEvents.push(event);save();busy=true;controller=new AbortController();updateStatus();
    let partial='';
    try{
      const response=await fetch(state.aiConfig.base+'/api/nhip/chat',{method:'POST',credentials:'omit',redirect:'error',headers:{'Content-Type':'application/json','X-TechPath-Token':token},body:JSON.stringify(payload),signal:controller.signal});
      if(!response.ok){let detail;try{detail=await response.json();}catch{}if(response.status===403){connected=false;token=null;}throw new Error(detail?.error||'Kết nối trả HTTP '+response.status+'. Yêu cầu không tự gửi lại.');}
      const reader=response.body.getReader(),decoder=new TextDecoder();let buffer='',done=false,streamError=null;
      function consume(line){
        if(!line.trim())return;
        const item=JSON.parse(line);
        if(item.type==='delta'){partial+=String(item.text||'');if(partial.length>24000)throw new Error('Phản hồi quá dài. Đã dừng để giữ phiên gọn.');onUpdate(partial);}
        if(item.type==='done'){partial=String(item.text||partial);done=true;onUpdate(partial);}
        if(item.type==='error')streamError=String(item.text||'Model chưa trả lời được.');
      }
      while(true){const chunk=await reader.read();if(chunk.done)break;buffer+=decoder.decode(chunk.value,{stream:true});let index;while((index=buffer.indexOf('\n'))>=0){consume(buffer.slice(0,index));buffer=buffer.slice(index+1);}if(buffer.length>200000)throw new Error('Dữ liệu phản hồi không hợp lệ.');}
      buffer+=decoder.decode();if(buffer.trim())consume(buffer);
      if(streamError)throw new Error(streamError);
      if(!done||!partial.trim())throw new Error('Phản hồi chưa hoàn tất. Không coi nội dung dở là kết quả đã xác nhận.');
      event.output=partial;event.status='completed';save();return event;
    }catch(error){controller.abort();event.output=partial;event.status=error.name==='AbortError'?'cancelled':'error';event.error=errorText(error);save();throw new Error(event.error);}
    finally{busy=false;controller=null;updateStatus();}
  }
  function annotate(eventId,label,correction='',scope='once') {
    const event=state.aiEvents.find(item=>item.id===eventId&&item.status==='completed');
    if(!event)return;
    state.aiAnnotations.push({id:crypto.randomUUID(),sourceEventId:eventId,at:new Date().toISOString(),label,correction,scope,userConfirmed:true});save();updateDataCounts();
  }
  function download(value,name,type){const url=URL.createObjectURL(new Blob([value],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  function updateDataCounts(){
    $('#ai-data-count').textContent=`${state.aiEvents.length} lượt đã ghi · ${state.aiAnnotations.length} phản hồi đã xác nhận`;
    const list=$('#ai-memory-list');list.replaceChildren();
    if(!state.aiMemory.length)return;
    list.append(element('h3','','Những điều bạn đã chọn ghi nhớ'));
    for(const memory of state.aiMemory){
      const row=element('div','memory-record');row.append(element('p','',String(memory.text)));
      const remove=element('button','text-button','Bỏ ghi nhớ');remove.type='button';
      remove.addEventListener('click',()=>{state.aiMemory=state.aiMemory.filter(item=>item!==memory);annotate(memory.sourceEventId,'memory_revoked',memory.text,'future');save();updateDataCounts();});row.append(remove);list.append(row);
    }
  }
  $('#ai-export-reviewed').addEventListener('click',()=>{
    const records=state.aiAnnotations.map(annotation=>{const event=state.aiEvents.find(item=>item.id===annotation.sourceEventId);return event?{schema:'nhip-eval/v1',context:event.context,input:event.input,candidate:event.output,provider:event.provider,model:event.model,annotation}:null;}).filter(Boolean);
    if(!records.length){notify('Chưa có phản hồi được bạn xác nhận để xuất.');return;}
    download(records.map(record=>JSON.stringify(record)).join('\n')+'\n','nhip-reviewed-'+dayKey()+'.jsonl','application/x-ndjson');
  });
  $('#ai-export-log').addEventListener('click',()=>download(JSON.stringify({schema:'nhip-log/v1',events:state.aiEvents,annotations:state.aiAnnotations},null,2),'nhip-session-log-'+dayKey()+'.json','application/json'));
  $('#ai-data-open').addEventListener('click',()=>{updateDataCounts();$('#ai-user-context').value=state.aiUserContext;$('#ai-user-context-preview').hidden=true;$('#ai-context-details').open=false;$('#ai-data-dialog').showModal();});
  $('#ai-user-context').addEventListener('input',()=>{$('#ai-user-context-preview').hidden=true;});
  $('#ai-preview-user-context').addEventListener('click',()=>{
    const text=$('#ai-user-context').value.trim();$('#ai-user-context-text').textContent=text||'Không chia sẻ bối cảnh bổ sung.';$('#ai-user-context-preview').hidden=false;
  });
  $('#ai-save-user-context').addEventListener('click',()=>{state.aiUserContext=$('#ai-user-context').value.trim().slice(0,1200);save();$('#ai-user-context-preview').hidden=true;$('#ai-context-details').open=false;notify('Đã lưu lựa chọn trên trình duyệt. Chỉ gửi kèm khi bạn dùng AI.');});
  $('#ai-context-details').addEventListener('toggle',()=>{
    if(!$('#ai-context-details').open)return;
    const ctx=buildContext(window.NhipGuide?.context(undefined,true));
    $('#ai-context-preview').textContent=JSON.stringify(ctx,null,2);
  });
  $('#ai-data-close').addEventListener('click',()=>$('#ai-data-dialog').close());
  window.addEventListener('pagehide',()=>controller?.abort());
  window.NhipAI={send,annotate,openConnection,stop:()=>controller?.abort(),get busy(){return busy;},get connected(){return connected;},buildContext};
  updateStatus();updateDataCounts();
})();
