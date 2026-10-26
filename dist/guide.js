(() => {
  'use strict';
  state.aiHelpThreads=state.aiHelpThreads&&typeof state.aiHelpThreads==='object'?state.aiHelpThreads:{};
  let drawerMode='chat',feedbackMission=null,feedbackEvent=null,drawerFocus=null;
  const drawer=$('#chat-drawer');
  const el=(tag,cls,text)=>element(tag,cls,text);
  function button(text,cls,fn){const b=el('button',cls,text);b.type='button';b.addEventListener('click',fn);return b;}
  function currentMission(){return window.NhipWorkshop.missionById(state.workshop?.id);}
  function guideState(){
    const journey=state.workshop;if(!journey)return null;
    if(!journey.guide)journey.guide={introSeen:journey.answers.length>0,threads:{},drafts:{},usedAI:false};
    if(!journey.aiKey)journey.aiKey=crypto.randomUUID();
    return journey.guide;
  }
  function context(idOverride,includeGuide=false){
    const journey=state.workshop;
    const mission=window.NhipWorkshop.missionById(idOverride)||currentMission();
    const index=journey&&mission&&mission.id===journey.id?journey.index:0;
    const step=mission?.steps[Math.min(index,mission.steps.length-1)];
    const sameTask=!!(journey&&mission&&mission.id===journey.id);
    const activity=sameTask&&mission?.kind==='activity';
    const phase=sameTask&&journey.index>=journey.limit?'completed':activity?'step':journey?.guide?.introSeen?'step':'introduction';
    const key=activity?'activity-'+index:phase==='introduction'?'intro':'step-'+index;
    const guideConversation=includeGuide&&sameTask?(journey.guide?.threads?.[key]||[]).filter(message=>['user','assistant'].includes(message.role)&&!message.hidden&&!message.pending&&!message.failed).slice(-2).map(message=>({role:message.role,text:String(message.text).slice(0,900)})):[];
    return {app:'Nhịp',version:3,liveLearningProgress:false,view:location.hash.slice(1)||'next',
      localNow:{date:dayKey(),time:clockTime(),timezone:timeZone},
      appRole:'Đồng hành quản lý thời gian và chọn việc theo mục tiêu do người dùng cung cấp. Các nhiệm vụ AI hiện có là ví dụ thực hành, không đại diện toàn bộ sở thích hoặc hướng nghề. Lịch linh hoạt; chưa rõ thì hỏi một điểm hoặc đưa 2–3 lựa chọn cụ thể.',
      appHelp:'Khám phá: chọn việc hoặc tự chọn. Ghi nhanh: lưu/sửa hoạt động. Nhìn lại: thời gian và kết quả đã xác nhận. Hỏi Nhịp: chat theo ngữ cảnh. Model dùng qua bộ kết nối TechPath trên máy; chưa đồng bộ tiến độ học. Bản nháp và phản hồi ở trình duyệt, không có fine-tuning tự động. Chỉ xuất dữ liệu khi bấm xuất.',
      connection:{connected:!!window.NhipAI?.connected,provider:state.aiConfig?.provider||null,model:state.aiConfig?.model||null},
      task:mission?{id:mission.id,kind:mission.kind||'sample',categoryLabel:mission.categoryLabel||mission.label,title:sameTask?(state.session?.task.title||mission.title):mission.title,goal:sameTask&&journey.limit===1?'Một kết quả được người dùng xác nhận':mission.output,phase,step:Math.min(index+1,sameTask?journey.limit:mission.steps.length),total:sameTask?journey.limit:mission.steps.length,...(step?.input!==undefined?{material:step.input}:{}),...(step?.candidate!==undefined?{candidate:step.candidate}:{}),question:step?.question,choices:Array.isArray(step?.choices)?step.choices:[],inputMode:step?.inputMode||'text'}:state.session?{title:state.session.task.title}:null,
      confirmedSteps:mission&&journey&&mission.id===journey.id?journey.answers.slice(-2).map(a=>({title:a.title,text:a.text.slice(0,700)})):[],
      approvedSessionNotes:journey?.guideNotes?.slice(-2).map(note=>String(note).slice(0,800))||[],
      recordedActivities:todayEntries().filter(entry=>!entry.sample).slice(-3).map(entry=>({title:entry.title,time:entry.time,minutes:entry.minutes,outcome:entry.outcome.slice(0,300)})),
      recordCoverage:'Chỉ có các bản ghi thật đã lưu; chưa biết những khoảng chưa ghi nhận. Bản ghi mẫu không phải lịch sử người dùng.',
      recentConfirmedSessions:(state.workshopHistory||[]).filter(session=>session&&typeof session.result==='string'&&typeof session.followup==='string').slice(-2).map(session=>({missionId:session.missionId,title:session.title,date:session.date,result:session.result.slice(0,350),followup:session.followup.slice(0,350)})),
      ...(guideConversation.length?{guideConversation}:{}),
    };
  }
  function threadFor(key){const g=guideState();if(!g)return[];if(!Array.isArray(g.threads[key]))g.threads[key]=[];return g.threads[key];}
  function history(thread){return thread.filter(m=>['user','assistant'].includes(m.role)&&!m.failed&&!m.pending).map(m=>({role:m.role,text:m.text})).slice(-6);}
  function messageNode(message,place){
    const row=el('div','conversation-message '+message.role+(message.pending?' pending':''));
    const name=message.role==='user'?'Bạn':message.role==='assistant'?'Nhịp · AI':'Nhịp';
    row.append(el('span','message-author',name),el('div','message-text',message.text||'Đang nghĩ cùng bạn…'));
    if(message.eventId&&!message.pending&&!message.failed){
      const actions=el('div','message-review');
      actions.append(button(message.reviewed?'Đã ghi nhận':'Đúng ý', 'text-button',()=>{if(message.reviewed)return;window.NhipAI.annotate(message.eventId,'helpful');message.reviewed=true;save();place==='guide'?paintGuide():paintChat();notify('Đã ghi phản hồi cho bộ kiểm thử; chưa đổi ưu tiên.');}));
      actions.append(button('AI hiểu sai', 'text-button',()=>feedback(state.workshop?.id||null,message.eventId)));
      if(place==='chat'&&message.mode==='feedback'&&!message.applied){
        const preview=el('div','memory-preview');preview.append(el('small','','CÁCH HƯỚNG DẪN ĐỀ XUẤT — BẠN CHỌN TRƯỚC KHI DÙNG'));
        preview.append(button('Dùng cho phiên này','button outlined',()=>applyMemory(message,'once')));
        preview.append(button('Nhớ cho việc tương tự','button primary',()=>applyMemory(message,'future')));row.append(preview);
      }
      row.append(actions);
    }
    return row;
  }
  function paintGuide(){
    const target=$('#guide-messages');if(!target||!state.workshop)return;
    const mission=currentMission(),g=guideState(),key=mission?.kind==='activity'?'activity-'+state.workshop.index:(g.introSeen?'step-'+state.workshop.index:'intro');
    target.replaceChildren();for(const message of threadFor(key))if(!message.hidden)target.append(messageNode(message,'guide'));
  }
  async function askGuide(prompt,{kind='action',intro=false}={}){
    if(window.NhipAI.busy){notify('Mình đang trả lời một lượt. Bạn có thể bấm Dừng nếu muốn đổi câu hỏi.');return;}
    if(!window.NhipAI.connected){window.NhipAI.openConnection();return;}
    const journey=state.workshop,g=guideState();if(!journey||!g)return;
    const key=intro?'intro':(currentMission()?.kind==='activity'?'activity-':'step-')+journey.index,thread=threadFor(key),previous=history(thread);
    const user={role:'user',text:prompt,kind,hidden:kind==='action'};thread.push(user);
    const reply={role:'assistant',text:'',pending:true};thread.push(reply);save();render();
    try{
      const event=await window.NhipAI.send({mode:intro?'intro':'guide',prompt,history:previous,onUpdate:text=>{reply.text=text;if(state.workshop===journey)paintGuide();}});
      reply.text=event.output;reply.eventId=event.id;reply.pending=false;g.usedAI=true;
      if(kind==='answer')g.drafts[key]='';save();
    }catch(error){reply.pending=false;reply.failed=true;reply.role='note';reply.text=error.message;user.failed=true;save();}
    if(state.workshop===journey){render();if(kind==='answer')$('#guide-input')?.focus({preventScroll:true});}
  }
  function renderActivity(journey,mission){
    const content=$('#work-content'),progress=$('#work-progress'); content.replaceChildren(); progress.replaceChildren();
    journey.answers=Array.isArray(journey.answers)?journey.answers:[];
    journey.drafts=journey.drafts&&typeof journey.drafts==='object'?journey.drafts:{};
    journey.inputs=journey.inputs&&typeof journey.inputs==='object'?journey.inputs:{};
    journey.limit=Math.max(1,Math.min(mission.steps.length,Number(journey.limit)||mission.steps.length));
    journey.index=Math.max(0,Math.min(journey.limit,Number.isInteger(journey.index)?journey.index:0));
    const g=guideState(), step=mission.steps[journey.index];
    $('#work-output').textContent=mission.output; $('#work-feedback').hidden=false; $('#work-overline').textContent=mission.categoryLabel;
    for(let i=0;i<journey.limit;i++) progress.append(el('div','progress-step '+(i<journey.index?'complete':i===journey.index?'current':''),`${i<journey.index?'✓':String(i+1).padStart(2,'0')} ${mission.steps[i].title}`));
    if(journey.index>=journey.limit){
      content.append(el('span','step-overline','KẾT QUẢ ĐỂ BẠN XÁC NHẬN'),el('h2','step-title','Kiểm tra điều bạn muốn giữ.'),el('p','guide-lead','Bản nháp chưa được ghi nhận là kết quả cho đến khi bạn xác nhận.'));
      const preview=el('textarea','activity-artifact'); preview.id='activity-artifact'; preview.dataset.artifactPreview='true'; preview.rows=5; preview.value=journey.artifact?.text||journey.answers.filter(Boolean).map(answer=>`${answer.title}: ${answer.text}`).join('\n'); preview.addEventListener('input',()=>{journey.artifact={text:preview.value,source:'user',confirmed:false};save();});
      content.append(el('label','','Kết quả có thể chỉnh sửa'),preview);
      if(!journey.artifact?.confirmed){ const confirmArtifact=button('Giữ kết quả này','button primary',()=>{journey.artifact={text:preview.value.trim(),source:'user',confirmed:true};save();render();}); confirmArtifact.dataset.action='confirm-artifact'; content.append(confirmArtifact); return; }
      if(mission.id==='ai-preferences'){
        const memory=el('details','memory-confirmation'); memory.open=true; memory.append(el('summary','','Xem điều muốn nhớ (không bắt buộc)'));
        const support=journey.inputs?.support||'cách hỗ trợ đã chọn';
        const note=el('textarea','memory-note'); note.rows=2; note.maxLength=500; note.value=journey.memoryDraft||`Bạn muốn AI ưu tiên ${support.toLowerCase()} trong những việc tương tự.`; note.addEventListener('input',()=>{journey.memoryDraft=note.value;save();});
        const controls=el('div','memory-actions');
        controls.append(button('Chỉ giữ cho phiên này','button outlined',()=>{journey.guideNotes=[...(journey.guideNotes||[]),note.value.trim()];save();window.NhipWorkshop.finish();}));
        controls.append(button('Nhớ cho việc tương tự','button primary',()=>{if(note.value.trim()){state.aiMemory=Array.isArray(state.aiMemory)?state.aiMemory:[];state.aiMemory.push({text:note.value.trim(),missionId:mission.id,at:new Date().toISOString(),source:'confirmed'});}save();window.NhipWorkshop.finish();}));
        controls.append(button('Bỏ qua','text-button',()=>window.NhipWorkshop.finish())); memory.append(el('p','field-hint','Chỉ lưu điều bạn tự xem lại và xác nhận; mặc định không ghi nhớ lâu dài.'),note,controls); content.append(memory);
      } else content.append(button('Kết thúc & lưu kết quả','button primary',()=>window.NhipWorkshop.finish()));
      return;
    }
    const stepWrap=el('section','activity-step'); stepWrap.dataset.activityStep=step.id;
    const stepTitle=el('h2','step-title',step.title); stepTitle.dataset.field='step-title';
    const stepQuestion=el('label','step-question',step.question); stepQuestion.dataset.field='step-question'; stepQuestion.htmlFor='activity-step-input';
    stepWrap.append(el('span','step-overline',`BƯỚC ${journey.index+1} / ${journey.limit}`),stepTitle,el('p','guide-lead',mission.intro||mission.description),stepQuestion);
    let input;
    if(step.inputMode==='choice'||step.inputMode==='action'){
      input=el('div','activity-choices'); input.dataset.stepInput=step.inputMode;
      for(const choice of step.choices||[]){const b=button(choice,'button outlined',()=>{journey.inputs[step.id]=choice;journey.drafts[journey.index]=choice==='Tự viết'||choice==='Nhập tên bài'?'':choice;save();render();}); b.dataset.stepInput=step.inputMode; if(journey.inputs[step.id]===choice)b.classList.add('selected'); input.append(b);}
      if(['Tự viết','Nhập tên bài'].includes(journey.inputs[step.id])){
        const free=el('textarea','step-input'); free.id='activity-step-input'; free.dataset.stepInput='text'; free.rows=3; free.maxLength=4000; free.value=journey.drafts[journey.index]||''; free.placeholder='Viết theo cách của bạn…'; free.addEventListener('input',()=>{journey.drafts[journey.index]=free.value;journey.inputs[step.id]=free.value;save();}); input.append(free);
      }
    }else{
      const prefilled = step.inputMode==='artifact' && !journey.drafts[journey.index]
        ? (mission.id==='ai-preferences'
          ? `Mình muốn: ${journey.inputs.need || 'một việc cụ thể'}. Cách hỗ trợ trước: ${journey.inputs.support || 'chưa chọn'}.`
          : mission.id==='ai-real-draft'
            ? `Tin nhắn cần nói: ${journey.inputs.message || 'chưa nhập'}\nGiọng điệu: ${journey.inputs.tone || 'chưa chọn'}`
            : journey.inputs[step.id] || '')
        : journey.drafts[journey.index]||journey.inputs[step.id]||'';
      input=el('textarea','step-input'); input.id='activity-step-input'; input.dataset.stepInput=step.inputMode||'text'; input.rows=3; input.maxLength=4000; input.value=prefilled; input.placeholder=step.optional?'Không bắt buộc — bạn có thể để trống…':'Viết theo cách của bạn. Một câu cũng được…'; input.addEventListener('input',()=>{journey.drafts[journey.index]=input.value;journey.inputs[step.id]=input.value;save();});
      if(prefilled && !journey.drafts[journey.index]) journey.drafts[journey.index]=prefilled;
    }
    stepWrap.append(input);
    const error=el('p','form-error'); error.setAttribute('role','alert'); content.append(error);
    const actions=el('div','activity-actions');
    const confirm=button(step.optional?'Bỏ qua bước này':'Xác nhận bước này','button primary',()=>{
      const answer=(journey.drafts[journey.index]||journey.inputs[step.id]||'').trim();
      if(!answer&&!step.optional){error.textContent='Bạn thêm một câu trả lời hoặc chọn một phương án nhé.';return;}
      journey.answers[journey.index]={stepId:step.id,title:step.title,text:answer}; delete journey.drafts[journey.index]; journey.index++; save(); render();
    }); confirm.dataset.action='confirm-step'; actions.append(confirm);
    if(step.aiAction){const prompt=mission.id==='ai-real-draft'&&step.id==='draft'
      ?`Soạn một bản nháp ngắn chỉ từ nội dung người dùng đã nhập trong phiên này: “${journey.inputs.message||''}”. Giọng điệu đã chọn: “${journey.inputs.tone||'chưa chọn'}”. Không thêm người nhận, dữ kiện hay lời hứa; chỉ trả bản nháp để người dùng sửa.`
      :`Giúp mình với bước “${step.question}”. Chỉ đưa một gợi ý ngắn và một câu hỏi tiếp theo.`;
      const ask=button(step.aiActionLabel||'Nhờ AI gợi ý','button outlined ai-action',()=>askGuide(prompt,{kind:'action'})); ask.dataset.action='ask-ai'; actions.append(ask);}
    stepWrap.append(error,actions); content.append(stepWrap);
    const thread=threadFor(`activity-${journey.index}`); if(thread.length){const messages=el('div','guide-messages'); messages.id='guide-messages'; for(const message of thread)if(!message.hidden)messages.append(messageNode(message,'guide')); content.append(messages);}
    if(window.NhipAI.busy) content.append(button('Dừng phản hồi','button quiet',()=>window.NhipAI.stop()));
    content.querySelectorAll('.ai-action').forEach((b)=>{b.disabled=window.NhipAI.busy;});
    content.append(el('p','guide-save-note','Bản nháp được giữ lại; Nhịp không tự gọi AI khi bạn quay lại.'));
  }
  function render(){
    const journey=state.workshop,mission=currentMission();if(!journey)return;
    if(!mission){const content=$('#work-content');content.replaceChildren(el('span','step-overline','PHIÊN ĐÃ LƯU'),el('h2','step-title','Hoạt động cũ không còn trong catalog.'),el('p','guide-lead','Dữ liệu phiên vẫn được giữ nguyên. Bạn có thể kết thúc để ghi nhận phần đã làm.'),button('Kết thúc & ghi nhận phần đã làm','button primary',()=>window.NhipWorkshop.finish()));return;}
    if(mission.kind==='activity'){renderActivity(journey,mission);return;}
    const g=guideState(),content=$('#work-content'),progress=$('#work-progress');content.replaceChildren();progress.replaceChildren();
    $('#work-output').textContent=mission.output;$('#work-feedback').hidden=false;
    $('#work-overline').textContent='CÙNG LÀM · MỖI LƯỢT MỘT BƯỚC';
    if(journey.index>=journey.limit){
      content.append(el('span','step-overline','NHỮNG BƯỚC BẠN ĐÃ CHỐT'),el('h2','step-title','Mình dừng lại nhìn kết quả nhé.'),el('p','guide-lead',`Bạn đã chốt ${journey.answers.length} lượt nhận xét. Bản tóm tắt sẽ để bạn xác nhận, không tự chấm mức thành thạo.`));
      content.append(button('Xem bản tóm tắt','button primary',()=>window.NhipWorkshop.finish()));return;
    }
    const intro=!g.introSeen,key=intro?'intro':'step-'+journey.index,thread=threadFor(key);
    content.append(el('span','step-overline',intro?'TRƯỚC KHI BẮT ĐẦU':`BƯỚC ${journey.index+1} / ${journey.limit}`));
    if(intro){
      content.append(el('h2','step-title','Mình sẽ làm gì cùng nhau?'),el('p','guide-lead',journey.limit===1?'Mình cùng xem một tình huống. Bạn chỉ cần chốt một nhận xét trước khi kết thúc.':mission.description));
      const outcome=el('p','guide-outcome','Kết thúc với: '+(journey.limit===1?'một nhận xét được bạn xác nhận':mission.output)+'.');content.append(outcome);
    }else{
      const source=el('details','guide-source');source.append(el('summary','','Xem tình huống đang dùng'));
      const step=mission.steps[journey.index];source.append(el('p','',step.input),el('p','source-candidate','Cách hiểu mẫu cần kiểm tra: '+step.candidate));content.append(source);
    }
    const messages=el('div','guide-messages');messages.id='guide-messages';messages.setAttribute('role','log');messages.setAttribute('aria-label','Hướng dẫn cho bước hiện tại');content.append(messages);paintGuide();
    const completed=thread.some(m=>m.role==='assistant'&&m.eventId&&!m.failed);
    if(intro){
      if(!completed)content.append(button(window.NhipAI.connected?'Nhờ AI giới thiệu ngắn':'Kết nối AI & bắt đầu','button primary ai-action',()=>askGuide('Giới thiệu ngắn nhiệm vụ này: làm gì, có ích thế nào và kết quả mang về. Chưa đưa bài tập; mời tôi bắt đầu bước đầu.',{intro:true})));
      else content.append(button('Hiểu rồi, bắt đầu bước 1','button primary ai-action',()=>{g.introSeen=true;save();render();askGuide('Bắt đầu bước hiện tại. Giải thích tình huống đơn giản rồi chỉ hỏi một câu để tôi thử.');}));
      content.append(button('Mình chưa hiểu nhiệm vụ này','text-button',()=>{openDrawer('chat');$('#chat-input').value='Giải thích đơn giản hơn hoạt động đang mở giúp mình.';$('#chat-input').focus();}));
    }else if(!thread.length){
      content.append(el('p','guide-lead','AI sẽ giải thích tình huống trước, rồi cùng bạn xử lý một điểm.'),button('Cùng bắt đầu bước này','button primary ai-action',()=>askGuide('Giải thích tình huống đang mở bằng lời đơn giản và dẫn tôi làm đúng một bước.')));
    }else{
      const form=el('form','guide-compose');
      const label=el('label','','Trò chuyện cùng AI');label.htmlFor='guide-input';form.append(label);
      const input=el('textarea');input.id='guide-input';input.rows=2;input.maxLength=4000;input.placeholder='Trả lời, hoặc nói chỗ bạn chưa hiểu…';input.value=g.drafts[key]||'';
      input.addEventListener('input',()=>{g.drafts[key]=input.value;save();});form.append(input);
      const send=el('button','button primary ai-action','Gửi');send.type='submit';send.append(icon('arrow'));form.append(send);
      form.addEventListener('submit',event=>{event.preventDefault();if(input.value.trim())askGuide(input.value.trim(),{kind:'answer'});});content.append(form);
      const helps=el('div','guide-helps');helps.append(button('Giải thích ngắn hơn','text-button ai-action',()=>askGuide('Mình chưa hiểu. Giải thích ngắn hơn bằng lời đơn giản, chưa yêu cầu mình làm thêm việc.')),button('Cho một ví dụ','text-button ai-action',()=>askGuide('Cho mình một ví dụ cụ thể để hiểu bước hiện tại, không đưa tất cả lời giải.')));content.append(helps);
      const lastAnswer=[...thread].reverse().find(m=>m.role==='user'&&m.kind==='answer'&&!m.failed);
      const lastReply=[...thread].reverse().find(m=>m.role==='assistant'&&m.eventId);
      if(lastAnswer&&lastReply&&!window.NhipAI.busy)content.append(button('Chốt điều vừa trao đổi & tiếp','button outlined guide-next',()=>{
        journey.answers[journey.index]={title:mission.steps[journey.index].title,text:lastAnswer.text,aiEventId:lastReply.eventId};
        window.NhipAI.annotate(lastReply.eventId,'step_confirmed',lastAnswer.text,'once');journey.index++;save();render();
      }));
    }
    if(window.NhipAI.busy)content.append(button('Dừng phản hồi','button quiet',()=>window.NhipAI.stop()));
    content.querySelectorAll('.ai-action').forEach(b=>b.disabled=window.NhipAI.busy);
    const footer=el('p','guide-save-note','Bạn có thể trả lời sau. Bản nháp được giữ; không tự gọi AI khi bạn quay lại.');content.append(footer);
  }
  function helpKey(){return state.workshop?.aiKey||'app';}
  function helpThread(){const key=helpKey();if(!Array.isArray(state.aiHelpThreads[key]))state.aiHelpThreads[key]=[];return state.aiHelpThreads[key];}
  function paintChat(){
    const target=$('#chat-messages');target.replaceChildren();
    if(!helpThread().length){
      const note=el('div','chat-welcome');note.append(icon('spark'),el('h3','','Bạn có thể hỏi ngay tại đây.'),el('p','',drawerMode==='feedback'?'Nói điều chưa hợp bằng lời của bạn. AI sẽ đề xuất một cách điều chỉnh để bạn chọn.':'Hỏi về hoạt động đang mở, cách dùng Nhịp hoặc điều bạn muốn hiểu thêm.'));target.append(note);
    }
    if(drawerMode==='feedback'&&feedbackEvent){const event=state.aiEvents.find(e=>e.id===feedbackEvent);if(event){const source=el('details','chat-reference');source.append(el('summary','','Câu trả lời đang góp ý'),el('p','',event.output));target.append(source);}}
    for(const message of helpThread())target.append(messageNode(message,'chat'));
    target.scrollTop=target.scrollHeight;
  }
  function syncDrawer(){const mobile=innerWidth<900,open=!drawer.hidden;$('.workspace').inert=mobile&&open;$('#chat-scrim').hidden=!(mobile&&open);drawer.setAttribute('role',mobile?'dialog':'complementary');if(mobile&&open)drawer.setAttribute('aria-modal','true');else drawer.removeAttribute('aria-modal');document.body.classList.toggle('chat-open',open);}
  function openDrawer(mode='chat'){
    drawerFocus=document.activeElement;drawerMode=mode;drawer.hidden=false;$('#chat-mode-label').textContent=mode==='feedback'?'Điều chỉnh cách hướng dẫn':'Hỏi về app & việc đang làm';$('#chat-error').textContent='';
    $('#chat-input').value=state.chatDraft||'';syncDrawer();paintChat();$('#chat-input').focus();
  }
  function closeDrawer(){drawer.hidden=true;syncDrawer();if(drawerFocus?.isConnected&&!drawerFocus.closest('[hidden]'))drawerFocus.focus();}
  function feedback(id,eventId=null){feedbackMission=id;feedbackEvent=eventId;openDrawer('feedback');}
  function applyMemory(message,scope){
    const note={text:message.text,missionId:message.missionId||null,sourceEventId:message.eventId,at:new Date().toISOString()};
    if(scope==='future')state.aiMemory.push(note);
    else if(state.workshop){state.workshop.guideNotes=Array.isArray(state.workshop.guideNotes)?state.workshop.guideNotes:[];state.workshop.guideNotes.push(message.text);}
    else{notify('Chưa có phiên đang mở. Bạn có thể chọn ghi nhớ cho lần sau.');return;}
    window.NhipAI.annotate(message.eventId,'user_approved_adjustment',message.text,scope);message.applied=scope;save();paintChat();notify(scope==='future'?'Đã ghi nhớ cách hướng dẫn bạn chọn cho việc tương tự.':'Đã thêm vào ngữ cảnh hướng dẫn của phiên này.');
  }
  async function sendChat(prompt){
    if(window.NhipAI.busy){$('#chat-error').textContent='Đang có một lượt trả lời. Chờ xong hoặc bấm Dừng.';return;}
    if(!window.NhipAI.connected){window.NhipAI.openConnection();return;}
    const thread=helpThread(),previous=history(thread),mode=drawerMode;
    const user={role:'user',text:prompt};thread.push(user);
    const reply={role:'assistant',text:'',pending:true,mode,missionId:feedbackMission||state.workshop?.id||null};thread.push(reply);save();paintChat();$('#chat-error').textContent='';
    const ctx=context(mode==='feedback'?feedbackMission:undefined,true);
    if(mode==='feedback'&&feedbackEvent){const event=state.aiEvents.find(e=>e.id===feedbackEvent);if(event)ctx.responseBeingReviewed={input:event.input.slice(0,1200),response:event.output.slice(0,2200)};}
    try{
      const event=await window.NhipAI.send({mode,prompt,history:previous,context:ctx,onUpdate:text=>{reply.text=text;paintChat();}});
      reply.text=event.output;reply.eventId=event.id;reply.pending=false;state.chatDraft='';$('#chat-input').value='';save();paintChat();
    }catch(error){reply.pending=false;reply.failed=true;reply.role='note';reply.text=error.message;user.failed=true;save();paintChat();}
  }
  $('#chat-launcher').addEventListener('click',()=>drawer.hidden?openDrawer():closeDrawer());
  $('#chat-close').addEventListener('click',closeDrawer);$('#chat-scrim').addEventListener('click',closeDrawer);
  $('#chat-reset-mode').addEventListener('click',()=>{drawerMode='chat';feedbackMission=null;feedbackEvent=null;$('#chat-mode-label').textContent='Hỏi về app & việc đang làm';paintChat();});
  $('#chat-input').addEventListener('input',()=>{state.chatDraft=$('#chat-input').value;save();});
  $('#chat-form').addEventListener('submit',event=>{event.preventDefault();const text=$('#chat-input').value.trim();if(text)sendChat(text);});
  $('#chat-stop').addEventListener('click',()=>window.NhipAI.stop());
  document.addEventListener('nhip:ai-state',()=>{
    $('#chat-stop').hidden=!window.NhipAI.busy;$('#chat-send').disabled=window.NhipAI.busy;
    $('#chat-connection-note').textContent=window.NhipAI.connected?state.aiConfig.model+' · gửi khi bạn chọn':'Chưa kết nối model';
    document.querySelectorAll('.ai-action,.guide-next').forEach(b=>b.disabled=window.NhipAI.busy);
    if(state.workshop&&currentMission()?.kind==='activity')render();
    const source=$('#sources-dialog .source-row:last-of-type strong');if(source)source.textContent=window.NhipAI.connected?'Đã kết nối qua máy':'Chưa kết nối';
  });
  document.addEventListener('keydown',event=>{
    if(drawer.hidden||document.querySelector('dialog[open]'))return;
    if(event.key==='Escape'){closeDrawer();return;}
    if(event.key==='Tab'&&innerWidth<900){const items=[...drawer.querySelectorAll('button:not([disabled]),textarea,a,input')].filter(item=>!item.hidden&&item.offsetParent!==null);const first=items[0],last=items.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}}
  });
  window.addEventListener('resize',syncDrawer);
  window.NhipGuide={render,context,feedback,openChat:openDrawer};
  $('#main').classList.add('conversation-version');
  if(state.workshop)render();
})();
