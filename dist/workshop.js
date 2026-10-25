/* Frontend workshop prototype. All authored cases are neutral examples, not a learner profile. */
(() => {
  'use strict';
  const missions = [
    { id: 'evaluate', tone: 'iris', icon: 'spark', label: 'THỬ LÀM NGƯỜI ĐÁNH GIÁ AI', title: 'Bắt lỗi một cách hiểu của AI.', description: 'Ba tình huống có sẵn. Bạn tìm chỗ suy diễn và diễn đạt lại điều AI cần hiểu.', output: '3 trường hợp kiểm thử có nhận xét của bạn', shortOutput: 'Một bộ kiểm thử nhỏ', action: 'Thử trường hợp đầu', kit: '3 tình huống + câu trả lời mẫu', visual: 'Một lời nhắn. Hai cách hiểu.', steps: [
      { title: 'Một sở thích có phải là tất cả?', input: '“Tuần này, mình muốn thử nhiều hoạt động thực hành hơn.”', candidate: '“Từ nay chỉ đưa bài thực hành và bỏ toàn bộ hoạt động khác.”', question: 'Bạn muốn sửa cách hiểu này như thế nào?', hints: ['Tăng ưu tiên một chút, vẫn giữ các lựa chọn khác.', 'Chỉ thử thay đổi trong giai đoạn này.'] },
      { title: 'Một kết quả nói lên điều gì?', input: 'Một bản thử đã hoàn thành. Người dùng chọn phương án và kiểm tra kết quả; AI hỗ trợ triển khai.', candidate: '“Người dùng đã tự thành thạo toàn bộ kỹ thuật để tạo bản thử.”', question: 'Nên ghi nhận kết quả và đóng góp ra sao?', hints: ['Ghi đúng phần người dùng xác nhận đã tham gia.', 'Tách kết quả tạo được và khả năng tự thực hiện.'] },
      { title: 'Khép một việc, giữ một cơ hội.', input: '“Việc này xong rồi. Mình chưa muốn làm thêm một việc giống vậy.”', candidate: '“Ẩn vĩnh viễn mọi nhiệm vụ tương tự.”', question: 'Bạn muốn điều chỉnh những gợi ý sau ở mức nào?', hints: ['Giảm nhẹ tần suất, vẫn giữ cơ hội thử lại.', 'Giữ sự đa dạng và xem thêm phản hồi sau.'] },
    ] },
    { id: 'context', tone: 'peach', icon: 'grid', label: 'THỬ THIẾT KẾ NGỮ CẢNH', title: 'Chọn dữ liệu giúp AI hiểu đúng.', description: 'Từ một bản tiến độ minh hoạ, chọn thông tin cần để gợi ý đúng bước tiếp theo.', output: 'Một bản dữ liệu đầu vào gồm 3 quyết định', shortOutput: 'Một mẫu dữ liệu đầu vào', action: 'Mở bản dữ liệu mẫu', kit: 'Bản tiến độ minh hoạ có sẵn', visual: 'Đúng dữ liệu. Đúng bước tiếp.', steps: [
      { title: 'Biết đang dừng ở đâu.', input: 'Bản tiến độ mẫu: bài “Làm sạch dữ liệu”; trạng thái “đang làm”; bước “kiểm tra giá trị thiếu”. Đây không phải tiến độ thật.', candidate: '“Chỉ cần tổng số bài đã mở là đủ để chọn bài tiếp theo.”', question: 'Bạn muốn AI nhận thêm thông tin nào về bước đang làm?', hints: ['Tên bài, bước đang dở và trạng thái xác nhận.', 'Phân biệt đã mở, đã thử và đã hoàn thành.'] },
      { title: 'Biết điều gì đang cản trở.', input: 'Bản ghi mẫu: đã thử hai lần; ghi chú “chưa hiểu vì sao kết quả thiếu một dòng”.', candidate: '“Đã thử hai lần nên cần chuyển sang bài khó hơn.”', question: 'Điều gì cần được giữ lại để gợi ý có ích hơn?', hints: ['Giữ chỗ đang vướng và kết quả đã kiểm tra.', 'Chưa suy ra mức thành thạo từ số lần thử.'] },
      { title: 'Biết dữ liệu còn mới không.', input: 'Bản tiến độ được sao lưu từ một phiên trước. Chưa có kết nối trực tiếp với nguồn học tập.', candidate: '“Có thể coi đây là tiến độ hiện tại và tự chọn bài mới.”', question: 'Bạn muốn xử lý độ mới của dữ liệu thế nào?', hints: ['Hiện thời điểm cập nhật và hỏi khi chưa chắc.', 'Ghi rõ dữ liệu mẫu hoặc chưa đồng bộ.'] },
    ] },
    { id: 'design', tone: 'sky', icon: 'edit', label: 'THỬ THIẾT KẾ MỘT TRẢI NGHIỆM', title: 'Biến một ý mơ hồ thành việc làm được.', description: 'Xem một thẻ gợi ý mẫu. Chốt điểm bắt đầu, đầu vào và dấu hiệu hoàn thành.', output: 'Một thẻ nhiệm vụ có 3 phần do bạn chốt', shortOutput: 'Một nhiệm vụ đủ rõ để bắt đầu', action: 'Cùng sửa một thẻ', kit: 'Thẻ trước/sau + 3 điểm cần chốt', visual: 'Từ “làm gì đó” đến “bắt đầu đây”.', steps: [
      { title: 'Một hành động bắt đầu được.', input: 'Thẻ mẫu: “Tìm hiểu thêm về một công cụ AI hữu ích.”', candidate: 'Người dùng vẫn phải tự chọn công cụ, tìm tài liệu và quyết định cần làm gì.', question: 'Bạn sẽ đổi bước đầu tiên thành hành động cụ thể nào?', hints: ['Mở một bản trả lời mẫu có sẵn và chỉ ra một chỗ cần kiểm tra.', 'So sánh hai cách diễn giải cùng một yêu cầu có sẵn.'] },
      { title: 'Có sẵn thứ để làm.', input: 'Thẻ đã có bước đầu nhưng yêu cầu người dùng tự tìm một ví dụ trên mạng.', candidate: '“Có thể bắt đầu ngay” dù chưa cung cấp ví dụ hay nguồn.', question: 'Bạn muốn chuẩn bị sẵn đầu vào nào?', hints: ['Một tình huống ngắn, hai câu trả lời và chỗ ghi nhận xét.', 'Một bản mẫu có thể mở ngay trong phiên.'] },
      { title: 'Nhận ra khi nào đã đủ.', input: 'Thẻ mẫu kết thúc bằng “tiếp tục cho đến khi hiểu rõ”.', candidate: 'Không có kết quả cụ thể để người dùng tự xác nhận đã hoàn thành.', question: 'Dấu hiệu hoàn thành nhỏ nhất nên là gì?', hints: ['Chọn một phương án và giải thích một lý do.', 'Lưu một cặp trước/sau cùng một tiêu chí kiểm tra.'] },
    ] },
  ];
  const missionById = (id) => missions.find((mission) => mission.id === id);
  const variants = {
    small: { label: 'Bắt đầu nhỏ hơn', description: 'Chỉ thử một trường hợp. Hoàn thành khi bạn xác nhận một nhận xét.', title: 'Thử một trường hợp, chốt một điều.', limit: 1 },
    guided: { label: 'Có điểm tựa rõ hơn', description: 'Hiện sẵn các ý tham khảo ở từng bước. Bạn có thể chọn rồi sửa bằng lời của mình.', title: 'Thử từng bước với một điểm tựa.', limit: 3 },
    visual: { label: 'Đặt hai cách hiểu cạnh nhau', description: 'So sánh trực quan đầu vào và cách hiểu của AI, rồi chốt một điểm cần sửa.', title: 'So sánh hai cách hiểu, sửa một điểm.', limit: 1 },
  };
  const validVariant = (value) => Object.hasOwn(variants, value);
  state.missionScores = state.missionScores && typeof state.missionScores === 'object' ? state.missionScores : {};
  state.missionOverrides = state.missionOverrides && typeof state.missionOverrides === 'object' ? state.missionOverrides : {};
  state.onceOverrides = state.onceOverrides && typeof state.onceOverrides === 'object' ? state.onceOverrides : {};
  state.approvedRules = Array.isArray(state.approvedRules) ? state.approvedRules : [];
  state.workshopHistory = Array.isArray(state.workshopHistory) ? state.workshopHistory : [];
  if (state.workshop && (!missionById(state.workshop.id) || !Array.isArray(state.workshop.answers) || !state.workshop.drafts || !Number.isInteger(state.workshop.index))) state.workshop = null;
  let feedbackMission = null;
  let chosenAdjustment = null;
  let feedbackFocus = null;

  function appendText(parent, tag, cls, text) { const child = element(tag, cls, text); parent.append(child); return child; }
  function makeButton(text, cls, handler) { const button = element('button', cls, text); button.type = 'button'; button.addEventListener('click', handler); return button; }
  function appliedVariant(id) {
    const variant = state.onceOverrides[id] || state.missionOverrides[id];
    return validVariant(variant) ? variant : null;
  }
  function missionTitle(mission, variant = appliedVariant(mission.id)) { return variant ? variants[variant].title : mission.title; }
  function previewArt(mission) {
    const art = element('div', 'mission-art ' + mission.tone);
    art.setAttribute('aria-hidden', 'true');
    if (mission.id === 'evaluate') {
      appendText(art, 'span', 'art-caption', 'TÍN HIỆU → CÁCH HIỂU');
      const paper = appendText(art, 'div', 'art-paper', '“Mình muốn thử thêm một chút.”');
      appendText(paper, 'span', 'art-wrong', 'Chỉ làm việc này từ nay?');
      const tag = appendText(art, 'span', 'art-verdict', 'Một chỗ cần nghĩ lại'); tag.prepend(icon('spark'));
      appendText(art, 'span', 'art-number', '01');
    } else if (mission.id === 'context') {
      appendText(art, 'span', 'art-caption', 'MỘT BẢN NGỮ CẢNH NHỎ');
      const data = element('div', 'art-data');
      for (const [key, value] of [['Đang làm', 'Một bước cụ thể'], ['Còn vướng', 'Một điều cần hiểu'], ['Đã kiểm tra', 'Một kết quả thật']]) {
        const row = element('div'); row.append(element('span', '', key), element('strong', '', value)); data.append(row);
      }
      art.append(data); appendText(art, 'span', 'art-number', '02');
    } else {
      appendText(art, 'span', 'art-caption', 'PHÁC THẢO → ĐIỀU LÀM ĐƯỢC');
      const sheet = appendText(art, 'div', 'art-sketch', 'Một ý tưởng');
      appendText(sheet, 'span', 'sketch-arrow', '↓');
      appendText(sheet, 'strong', '', 'Một bước đầu rõ ràng');
      appendText(art, 'span', 'sketch-star', '').append(icon('spark')); appendText(art, 'span', 'art-number', '03');
    }
    return art;
  }
  function renderHome() {
    const grid = $('#mission-grid');
    grid.replaceChildren();
    const ordered = [...missions].sort((a, b) => (Number(state.missionScores[b.id]) || 0) - (Number(state.missionScores[a.id]) || 0));
    for (const mission of ordered) {
      const card = element('article', 'mission-card ' + mission.tone);
      card.append(previewArt(mission));
      const body = element('div', 'mission-body');
      appendText(body, 'span', 'mission-label', mission.label);
      appendText(body, 'h2', '', missionTitle(mission));
      appendText(body, 'p', 'mission-description', appliedVariant(mission.id) ? variants[appliedVariant(mission.id)].description : mission.description);
      const kit = appendText(body, 'div', 'mission-kit', mission.kit); kit.prepend(icon('grid'));
      const output = element('div', 'mission-output'); appendText(output, 'small', '', 'MANG VỀ'); appendText(output, 'strong', '', appliedVariant(mission.id) ? 'Một nhận xét đã được bạn xác nhận' : mission.shortOutput); body.append(output);
      const start = makeButton(mission.action, 'button ' + (mission.id === 'evaluate' ? 'primary' : 'outlined') + ' mission-start', () => startMission(mission.id));
      start.append(icon('arrow')); body.append(start);
      const bottom = element('div', 'mission-foot');
      appendText(bottom, 'span', '', appliedVariant(mission.id) ? 'Có điều chỉnh bạn đã chọn' : 'Linh hoạt · không cần code');
      bottom.append(makeButton('Chưa hợp', 'text-button', () => openFeedback(mission.id)));
      body.append(bottom); card.append(body); grid.append(card);
    }
    const preferences = $('#approved-preferences'); preferences.replaceChildren();
    if (state.approvedRules.length) {
      appendText(preferences, 'span', 'small-overline', 'ĐIỀU CHỈNH BẠN ĐÃ CHỌN');
      for (const id of [...new Set(state.approvedRules.map((rule) => rule.missionId))]) {
        const mission = missionById(id); if (!mission) continue;
        const latest = [...state.approvedRules].reverse().find((rule) => rule.missionId === id);
        const row = element('div', 'approved-rule'); appendText(row, 'p', '', latest.text);
        row.append(makeButton('Đặt lại', 'text-button', () => { delete state.missionOverrides[id]; delete state.onceOverrides[id]; state.missionScores[id] = 0; state.approvedRules = state.approvedRules.filter((rule) => rule.missionId !== id); save(); renderHome(); notify('Đã đặt lại ưu tiên và cách làm cho nhóm này.'); }));
        preferences.append(row);
      }
    }
    renderSummaries();
  }
  function startMission(id) {
    if (state.session) { location.hash = 'work'; notify('Mình giữ nguyên phiên đang làm. Bạn có thể tiếp tục hoặc kết thúc phiên đó.'); return; }
    const mission = missionById(id), variant = appliedVariant(id);
    state.finishDraft = null;
    state.workshop = { id, variant, index: 0, answers: [], drafts: {}, limit: variant ? variants[variant].limit : mission.steps.length };
    delete state.onceOverrides[id];
    state.session = { task: { title: missionTitle(mission, variant), category: 'Làm việc', minutes: 20 }, elapsed: 0, startedAt: Date.now(), time: clockTime() };
    save(); renderSession(); location.hash = 'work'; renderWork();
  }
  function renderWork() {
    if (window.NhipGuide && state.workshop) { window.NhipGuide.render(); return; }
    const content = $('#work-content'), progress = $('#work-progress');
    content.replaceChildren(); progress.replaceChildren();
    if (!state.workshop) {
      appendText(content, 'span', 'step-overline', 'VIỆC DO BẠN TỰ CHỌN');
      appendText(content, 'h2', '', 'Cứ bắt đầu từ một phần vừa sức.');
      appendText(content, 'p', 'field-hint', 'Bạn có thể tạm dừng, quay lại hoặc kết thúc để ghi nhận kết quả.');
      $('#work-output').textContent = 'Kết quả do bạn tự ghi nhận khi kết thúc.';
      $('#work-feedback').hidden = true;
      return;
    }
    $('#work-feedback').hidden = false;
    const journey = state.workshop, mission = missionById(journey.id);
    journey.limit = Math.max(1, Math.min(mission.steps.length, Number(journey.limit) || mission.steps.length));
    journey.index = Math.max(0, Math.min(journey.limit, journey.index));
    $('#work-overline').textContent = mission.label;
    $('#work-output').textContent = journey.limit === 1 ? 'Một quyết định có nhận xét của bạn' : mission.output;
    for (let i = 0; i < journey.limit; i++) {
      const item = element('div', 'progress-step ' + (i < journey.index ? 'complete' : i === journey.index ? 'current' : ''));
      const number = element('span', 'progress-number', i < journey.index ? '✓' : String(i + 1).padStart(2, '0'));
      item.append(number, element('span', '', mission.steps[i].title)); progress.append(item);
    }
    if (journey.index >= journey.limit) {
      const done = element('div', 'work-done'); done.append(icon('check'));
      appendText(done, 'span', 'step-overline', 'ĐÃ CÓ NHỮNG QUYẾT ĐỊNH CỦA BẠN');
      appendText(done, 'h2', '', `${journey.answers.length} nhận xét để mang về.`);
      appendText(done, 'p', 'field-hint', 'Cùng xem lại kết quả và chọn điều bạn muốn giữ cho những lần sau.');
      done.append(makeButton('Xem lại & xác nhận', 'button primary', finish)); content.append(done);
      for (const answer of journey.answers) { const saved = element('div', 'saved-answer'); appendText(saved, 'strong', '', answer.title); appendText(saved, 'p', '', answer.text); content.append(saved); }
      return;
    }
    const step = mission.steps[journey.index];
    content.classList.toggle('visual-comparison', journey.variant === 'visual');
    appendText(content, 'span', 'step-overline', `TRƯỜNG HỢP ${journey.index + 1} / ${journey.limit}`);
    appendText(content, 'h2', 'step-title', step.title);
    const comparison = element('div', 'comparison');
    const material = element('section', 'input-material'); appendText(material, 'span', 'material-label', 'ĐẦU VÀO MẪU'); appendText(material, 'p', '', step.input);
    const candidate = element('section', 'candidate-material'); appendText(candidate, 'span', 'material-label', 'CÁCH HIỂU CẦN KIỂM TRA'); appendText(candidate, 'p', '', step.candidate);
    comparison.append(material, candidate); content.append(comparison);
    const form = element('form', 'step-form');
    const label = appendText(form, 'label', 'step-question', step.question); label.htmlFor = 'step-answer';
    const text = element('textarea'); text.id = 'step-answer'; text.rows = 3; text.maxLength = 2000; text.required = true; text.placeholder = 'Viết theo cách của bạn. Một câu cũng được…'; text.value = journey.drafts[journey.index] || '';
    text.addEventListener('input', () => { journey.drafts[journey.index] = text.value; save(); }); form.append(text);
    const hints = element('details', 'step-hints'); appendText(hints, 'summary', '', 'Cần một điểm tựa để bắt đầu?'); hints.open = journey.variant === 'guided';
    for (const hint of step.hints) hints.append(makeButton(hint, 'hint-button', () => { text.value = hint; journey.drafts[journey.index] = hint; save(); text.focus(); }));
    form.append(hints);
    const error = element('p', 'form-error'); error.setAttribute('role', 'alert'); form.append(error);
    const submit = element('button', 'button primary', 'Xác nhận nhận xét'); submit.type = 'submit'; submit.append(icon('arrow')); form.append(submit);
    appendText(form, 'p', 'step-save-note', 'Bản nháp được giữ lại. Nhận xét chưa tự thay đổi cách gợi ý.');
    form.addEventListener('submit', (event) => {
      event.preventDefault(); const answer = text.value.trim();
      if (!answer) { error.textContent = 'Bạn thêm một nhận xét hoặc chọn một ý tham khảo nhé.'; return; }
      journey.answers.push({ title: step.title, text: answer }); delete journey.drafts[journey.index]; journey.index++;
      save(); renderWork(); $('#work-content h2')?.setAttribute('tabindex', '-1'); $('#work-content h2')?.focus({ preventScroll: true });
    });
    content.append(form);
  }
  function openFeedback(id) { window.NhipGuide?.feedback(id); }
  $('#work-feedback').addEventListener('click', () => { if (state.workshop) openFeedback(state.workshop.id); });
  function updateFinishPreview() {
    $('#result-preview').textContent = $('#finish-result').value.trim() || 'Bạn chưa ghi kết quả để xác nhận.';
    const intent = $('#finish-intent').value;
    $('#intent-preview').textContent = intent === 'more' ? 'Tăng ưu tiên nhóm này một chút. Vẫn giữ các lựa chọn khác.' : intent === 'less' ? 'Giảm ưu tiên nhóm này một chút. Vẫn giữ cơ hội thử lại.' : 'Giữ nguyên ưu tiên. Chưa suy ra sở thích mới từ phiên này.';
  }
  function finish() {
    if (!state.workshop || !state.session) return;
    feedbackFocus = document.activeElement;
    state.session.elapsed = sessionElapsed(); state.session.startedAt = null; save(); renderSession();
    $('#finish-form').reset();
    const count = state.workshop.answers.length;
    const draft = state.finishDraft;
    $('#finish-result').value = draft?.result ?? (count ? `Đã xác nhận ${count} nhận xét trong nhiệm vụ “${state.session.task.title}”.` : 'Đã thử nhiệm vụ, chưa xác nhận nhận xét nào.');
    $('#finish-minutes').value = draft?.minutes ?? Math.max(1, Math.min(1440, Math.round(state.session.elapsed / 60000)));
    $('#finish-feedback').value = draft?.feedback || '';
    $('#finish-support').value = Object.hasOwn(supports, draft?.support) ? draft.support : state.workshop?.guide?.usedAI ? 'assisted' : 'unspecified';
    $('#finish-intent').value = ['more', 'less'].includes(draft?.intent) ? draft.intent : 'neutral';
    $('#finish-form').querySelectorAll('input[name="contribution"]').forEach((input) => { input.checked = !!draft?.contributions?.includes(input.value); });
    $('#finish-error').textContent = ''; updateFinishPreview(); $('#finish-dialog').showModal();
  }
  $('#finish-result').addEventListener('input', updateFinishPreview);
  $('#finish-intent').addEventListener('change', updateFinishPreview);
  function saveFinishDraft() {
    state.finishDraft = { result: $('#finish-result').value, minutes: $('#finish-minutes').value, feedback: $('#finish-feedback').value, support: $('#finish-support').value, intent: $('#finish-intent').value, contributions: [...$('#finish-form').querySelectorAll('input[name="contribution"]:checked')].map((input) => input.value) };
    save();
  }
  $('#finish-form').addEventListener('input', saveFinishDraft);
  $('#finish-form').addEventListener('change', saveFinishDraft);
  $('#finish-form').addEventListener('submit', (event) => {
    event.preventDefault(); if (!state.workshop || !state.session) return;
    const result = $('#finish-result').value.trim(), minutes = Number($('#finish-minutes').value);
    if (!result || !Number.isInteger(minutes) || minutes < 1 || minutes > 1440) { $('#finish-error').textContent = 'Xác nhận kết quả và thời lượng từ 1 đến 1.440 phút trước khi lưu.'; return; }
    const id = crypto.randomUUID(), journey = state.workshop;
    const intent = $('#finish-intent').value;
    const contributions = [...$('#finish-form').querySelectorAll('input[name="contribution"]:checked')].map((input) => input.value);
    const followup = $('#intent-preview').textContent;
    state.entries.push({ id, title: state.session.task.title, category: 'Làm việc', minutes, time: state.session.time, date: dayKey(), outcome: result, support: $('#finish-support').value, sample: false });
    state.workshopHistory.push({ id, missionId: journey.id, title: state.session.task.title, date: dayKey(), result, followup, contributions, feedback: $('#finish-feedback').value.trim(), answers: journey.answers });
    if (intent !== 'neutral') {
      const oldScore = Number(state.missionScores[journey.id]) || 0;
      state.missionScores[journey.id] = Math.max(-2, Math.min(2, oldScore + (intent === 'more' ? 1 : -1)));
      state.approvedRules.push({ missionId: journey.id, type: 'priority', text: followup, reason: $('#finish-feedback').value.trim() });
    }
    state.session = null; state.workshop = null; state.finishDraft = null; save(); renderSession(); renderRecords(); renderHome(); $('#finish-dialog').close(); location.hash = 'review'; notify('Đã lưu hai bản tóm tắt bạn xác nhận.');
  });
  function renderSummaries() {
    const parent = $('#session-summaries'); parent.replaceChildren();
    const sessions = state.workshopHistory.filter((session) => session && typeof session.result === 'string' && typeof session.followup === 'string').slice(-3).reverse();
    if (!sessions.length) return;
    appendText(parent, 'h2', '', 'Những phiên bạn đã xác nhận');
    for (const session of sessions) {
      const card = element('article', 'confirmed-session'); appendText(card, 'span', 'small-overline', session.date); appendText(card, 'h3', '', session.title);
      const summaries = element('div', 'finish-previews');
      const first = element('section'); appendText(first, 'span', '', 'KẾT QUẢ'); appendText(first, 'p', '', session.result);
      if (session.contributions?.length) appendText(first, 'small', '', 'Bạn tham gia: ' + session.contributions.join(' · '));
      const second = element('section'); appendText(second, 'span', '', 'HƯỚNG TIẾP THEO'); appendText(second, 'p', '', session.followup);
      summaries.append(first, second); card.append(summaries); parent.append(card);
    }
  }
  document.querySelectorAll('[data-close]').forEach((button) => button.addEventListener('click', () => $('#' + button.dataset.close).close()));
  for (const id of ['finish-dialog', 'sources-dialog']) {
    $('#' + id).addEventListener('close', () => { if (feedbackFocus?.isConnected && !feedbackFocus.closest('[hidden]')) feedbackFocus.focus(); else $('#main').focus({ preventScroll: true }); });
  }
  $('#source-status').addEventListener('click', () => { feedbackFocus = document.activeElement; $('#sources-dialog').showModal(); });
  function pauseOnLeave() {
    if (state.workshop && state.session && state.session.startedAt !== null) {
      state.session.elapsed = sessionElapsed(); state.session.startedAt = null; save(); renderSession();
    }
  }
  document.addEventListener('visibilitychange', () => { if (document.hidden) pauseOnLeave(); });
  window.addEventListener('pagehide', pauseOnLeave);
  window.NhipWorkshop = { renderHome, renderWork, finish, missions, missionById };
  renderHome(); renderSession();
})();
