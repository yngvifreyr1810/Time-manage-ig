/* Frontend workshop prototype. All authored cases are neutral examples, not a learner profile. */
(() => {
  'use strict';
  const missions = [
    { id: 'evaluate', kind: 'sample', tone: 'iris', icon: 'spark', label: 'THỬ LÀM NGƯỜI ĐÁNH GIÁ AI', title: 'Bắt lỗi một cách hiểu của AI.', description: 'Ba tình huống có sẵn. Bạn tìm chỗ suy diễn và diễn đạt lại điều AI cần hiểu.', output: '3 trường hợp kiểm thử có nhận xét của bạn', shortOutput: 'Một bộ kiểm thử nhỏ', action: 'Thử trường hợp đầu', kit: '3 tình huống + câu trả lời mẫu', visual: 'Một lời nhắn. Hai cách hiểu.', steps: [
      { title: 'Một sở thích có phải là tất cả?', input: '“Tuần này, mình muốn thử nhiều hoạt động thực hành hơn.”', candidate: '“Từ nay chỉ đưa bài thực hành và bỏ toàn bộ hoạt động khác.”', question: 'Bạn muốn sửa cách hiểu này như thế nào?', hints: ['Tăng ưu tiên một chút, vẫn giữ các lựa chọn khác.', 'Chỉ thử thay đổi trong giai đoạn này.'] },
      { title: 'Một kết quả nói lên điều gì?', input: 'Một bản thử đã hoàn thành. Người dùng chọn phương án và kiểm tra kết quả; AI hỗ trợ triển khai.', candidate: '“Người dùng đã tự thành thạo toàn bộ kỹ thuật để tạo bản thử.”', question: 'Nên ghi nhận kết quả và đóng góp ra sao?', hints: ['Ghi đúng phần người dùng xác nhận đã tham gia.', 'Tách kết quả tạo được và khả năng tự thực hiện.'] },
      { title: 'Khép một việc, giữ một cơ hội.', input: '“Việc này xong rồi. Mình chưa muốn làm thêm một việc giống vậy.”', candidate: '“Ẩn vĩnh viễn mọi nhiệm vụ tương tự.”', question: 'Bạn muốn điều chỉnh những gợi ý sau ở mức nào?', hints: ['Giảm nhẹ tần suất, vẫn giữ cơ hội thử lại.', 'Giữ sự đa dạng và xem thêm phản hồi sau.'] },
    ] },
    { id: 'context', kind: 'sample', tone: 'peach', icon: 'grid', label: 'THỬ THIẾT KẾ NGỮ CẢNH', title: 'Chọn dữ liệu giúp AI hiểu đúng.', description: 'Từ một bản tiến độ minh hoạ, chọn thông tin cần để gợi ý đúng bước tiếp theo.', output: 'Một bản dữ liệu đầu vào gồm 3 quyết định', shortOutput: 'Một mẫu dữ liệu đầu vào', action: 'Mở bản dữ liệu mẫu', kit: 'Bản tiến độ minh hoạ có sẵn', visual: 'Đúng dữ liệu. Đúng bước tiếp.', steps: [
      { title: 'Biết đang dừng ở đâu.', input: 'Bản tiến độ mẫu: bài “Làm sạch dữ liệu”; trạng thái “đang làm”; bước “kiểm tra giá trị thiếu”. Đây không phải tiến độ thật.', candidate: '“Chỉ cần tổng số bài đã mở là đủ để chọn bài tiếp theo.”', question: 'Bạn muốn AI nhận thêm thông tin nào về bước đang làm?', hints: ['Tên bài, bước đang dở và trạng thái xác nhận.', 'Phân biệt đã mở, đã thử và đã hoàn thành.'] },
      { title: 'Biết điều gì đang cản trở.', input: 'Bản ghi mẫu: đã thử hai lần; ghi chú “chưa hiểu vì sao kết quả thiếu một dòng”.', candidate: '“Đã thử hai lần nên cần chuyển sang bài khó hơn.”', question: 'Điều gì cần được giữ lại để gợi ý có ích hơn?', hints: ['Giữ chỗ đang vướng và kết quả đã kiểm tra.', 'Chưa suy ra mức thành thạo từ số lần thử.'] },
      { title: 'Biết dữ liệu còn mới không.', input: 'Bản tiến độ được sao lưu từ một phiên trước. Chưa có kết nối trực tiếp với nguồn học tập.', candidate: '“Có thể coi đây là tiến độ hiện tại và tự chọn bài mới.”', question: 'Bạn muốn xử lý độ mới của dữ liệu thế nào?', hints: ['Hiện thời điểm cập nhật và hỏi khi chưa chắc.', 'Ghi rõ dữ liệu mẫu hoặc chưa đồng bộ.'] },
    ] },
    { id: 'design', kind: 'sample', tone: 'sky', icon: 'edit', label: 'THỬ THIẾT KẾ MỘT TRẢI NGHIỆM', title: 'Biến một ý mơ hồ thành việc làm được.', description: 'Xem một thẻ gợi ý mẫu. Chốt điểm bắt đầu, đầu vào và dấu hiệu hoàn thành.', output: 'Một thẻ nhiệm vụ có 3 phần do bạn chốt', shortOutput: 'Một nhiệm vụ đủ rõ để bắt đầu', action: 'Cùng sửa một thẻ', kit: 'Thẻ trước/sau + 3 điểm cần chốt', visual: 'Từ “làm gì đó” đến “bắt đầu đây”.', steps: [
      { title: 'Một hành động bắt đầu được.', input: 'Thẻ mẫu: “Tìm hiểu thêm về một công cụ AI hữu ích.”', candidate: 'Người dùng vẫn phải tự chọn công cụ, tìm tài liệu và quyết định cần làm gì.', question: 'Bạn sẽ đổi bước đầu tiên thành hành động cụ thể nào?', hints: ['Mở một bản trả lời mẫu có sẵn và chỉ ra một chỗ cần kiểm tra.', 'So sánh hai cách diễn giải cùng một yêu cầu có sẵn.'] },
      { title: 'Có sẵn thứ để làm.', input: 'Thẻ đã có bước đầu nhưng yêu cầu người dùng tự tìm một ví dụ trên mạng.', candidate: '“Có thể bắt đầu ngay” dù chưa cung cấp ví dụ hay nguồn.', question: 'Bạn muốn chuẩn bị sẵn đầu vào nào?', hints: ['Một tình huống ngắn, hai câu trả lời và chỗ ghi nhận xét.', 'Một bản mẫu có thể mở ngay trong phiên.'] },
      { title: 'Nhận ra khi nào đã đủ.', input: 'Thẻ mẫu kết thúc bằng “tiếp tục cho đến khi hiểu rõ”.', candidate: 'Không có kết quả cụ thể để người dùng tự xác nhận đã hoàn thành.', question: 'Dấu hiệu hoàn thành nhỏ nhất nên là gì?', hints: ['Chọn một phương án và giải thích một lý do.', 'Lưu một cặp trước/sau cùng một tiêu chí kiểm tra.'] },
    ] },
  ];
  const activities = [
    { id: 'ai-preferences', kind: 'activity', categoryId: 'ai-collaboration', categoryLabel: 'Huấn luyện AI', logCategory: 'Làm việc', title: 'Cùng AI tìm cách hỗ trợ bạn tốt hơn', description: 'Bắt đầu từ một việc bạn đang muốn làm. Cùng chọn cách AI hỗ trợ; chỉ ghi nhớ điều bạn xác nhận.', intro: 'Chọn một việc thật bạn muốn làm. Mình cùng làm rõ yêu cầu, rồi chọn cách hỗ trợ phù hợp. Điều muốn nhớ sẽ được xem lại riêng. Ở đây, huấn luyện AI là cùng điều chỉnh cách hỗ trợ qua phản hồi bạn xác nhận.', output: 'Một yêu cầu rõ ràng và cách hỗ trợ bạn chọn.', shortOutput: 'Một yêu cầu rõ ràng và cách hỗ trợ bạn chọn.', action: 'Bắt đầu từ việc của mình', firstAction: 'Nói một việc bạn muốn AI giúp.', timeHint: 'Một bước trước · tiếp tục khi muốn', steps: [
      { id: 'need', title: 'Một việc bạn muốn làm', question: 'Lúc này bạn muốn AI giúp việc gì?', inputMode: 'text', choices: ['Làm rõ một ý tưởng', 'Viết một bản nháp', 'Chọn bước tiếp theo'] },
      { id: 'support', title: 'Cách hỗ trợ trước', question: 'Bạn muốn mình giúp bằng cách nào trước?', inputMode: 'choice', choices: ['Cùng nghĩ vài hướng', 'Đưa bản nháp để mình sửa', 'Hỏi từng câu để làm rõ', 'Tự viết'] },
      { id: 'request', title: 'Yêu cầu bạn muốn giữ', question: 'Kiểm tra yêu cầu này trước khi cùng làm.', inputMode: 'artifact', aiAction: true, aiActionLabel: 'Nhờ AI cùng làm' },
    ] },
    { id: 'ai-real-draft', kind: 'activity', categoryId: 'ai-collaboration', categoryLabel: 'Huấn luyện AI', logCategory: 'Làm việc', title: 'Soạn một tin nhắn bạn đang cần gửi', description: 'Dùng một tin nhắn bạn thực sự cần viết để thử cách AI hỗ trợ. Bạn kiểm tra bản nháp trước khi dùng.', intro: 'Dùng một tin nhắn bạn thực sự cần viết để thử cách AI hỗ trợ. Bạn kiểm tra bản nháp trước khi dùng.', output: 'Một bản tin nhắn đã chỉnh và xác nhận.', shortOutput: 'Một bản tin nhắn đã chỉnh và xác nhận.', action: 'Soạn tin nhắn', firstAction: 'Nói tin nhắn cần nói điều gì.', timeHint: 'Một bản nháp · không tự gửi', steps: [
      { id: 'message', title: 'Điều tin nhắn cần nói', question: 'Tin nhắn này cần nói điều gì?', inputMode: 'text' },
      { id: 'tone', title: 'Giọng điệu', question: 'Bạn muốn giọng điệu thế nào?', inputMode: 'choice', choices: ['Ngắn gọn', 'Thân mật', 'Trang trọng', 'Tự viết'] },
      { id: 'draft', title: 'Bản nháp để bạn sửa', question: 'Sửa và xác nhận bản nháp này khi bạn thấy ổn.', inputMode: 'artifact', aiAction: true, aiActionLabel: 'Nhờ AI soạn bản nháp' },
    ] },
    { id: 'work-next-step', kind: 'activity', categoryId: 'work-learning', categoryLabel: 'Việc và học', logCategory: 'Làm việc', title: 'Chốt bước tiếp theo cho một việc đang dở', description: 'Nêu việc đang dở, rồi chọn một hành động đủ nhỏ để bắt đầu. Thời lượng là tùy bạn.', intro: 'Mình chỉ ghi lại bước bạn chọn, không tự tạo lịch hay deadline.', output: 'Một bước tiếp theo và dấu hiệu đủ cho lần này.', shortOutput: 'Một bước tiếp theo đủ nhỏ để bắt đầu.', action: 'Chốt bước tiếp theo', firstAction: 'Nói việc bạn muốn tiến thêm một chút.', timeHint: 'Một bước nhỏ · không cần lịch', steps: [
      { id: 'task', title: 'Việc đang dở', question: 'Việc nào bạn muốn tiến thêm một chút?', inputMode: 'text' },
      { id: 'action', title: 'Bước nhỏ nhất', question: 'Bước nhỏ nhất bạn có thể làm ngay là gì?', inputMode: 'text', aiAction: true },
      { id: 'enough', title: 'Dấu hiệu đủ', question: 'Làm đến đâu thì đủ cho lần này?', inputMode: 'text', optional: true },
    ] },
    { id: 'learn-question', kind: 'activity', categoryId: 'work-learning', categoryLabel: 'Việc và học', logCategory: 'Học hỏi', title: 'Làm rõ một điều bạn đang muốn hiểu', description: 'Mang vào một câu hỏi hoặc đoạn ngắn. Mình cùng làm rõ một ý và ghi lại điều bạn thấy hữu ích.', intro: 'Bạn có thể tự ghi điều mình hiểu hoặc nhờ AI giải thích một ý; sự chưa chắc chắn vẫn được giữ rõ.', output: 'Một ghi chú hiểu biết ngắn do bạn xác nhận.', shortOutput: 'Một ghi chú hiểu biết ngắn.', action: 'Làm rõ một điều', firstAction: 'Nói điều bạn đang muốn hiểu.', timeHint: 'Một ý · không cần bài kiểm tra', steps: [
      { id: 'question', title: 'Điều muốn hiểu', question: 'Bạn đang muốn hiểu điều gì?', inputMode: 'text' },
      { id: 'note', title: 'Điều bạn thấy hữu ích', question: 'Bạn muốn ghi lại điều mình hiểu thế nào?', inputMode: 'artifact', aiAction: true },
    ] },
    { id: 'play-music', kind: 'activity', categoryId: 'rest-play', categoryLabel: 'Nghỉ và giải trí', logCategory: 'Giải trí', title: 'Dành một lúc cho bản nhạc bạn chọn', description: 'Chọn một bài có sẵn trong ứng dụng bạn dùng. Nghe bao lâu tùy bạn; Nhịp không tự mở nhạc.', intro: 'Chọn một bài có sẵn trong ứng dụng bạn dùng. Nghe bao lâu tùy bạn; Nhịp không tự mở nhạc.', output: 'Bài đã chọn và cảm nhận tùy ý của bạn.', shortOutput: 'Một khoảng nghe nhạc do bạn chọn.', action: 'Chọn bản nhạc', firstAction: 'Chọn bài hoặc danh sách quen thuộc.', timeHint: 'Bạn tự chọn thời lượng', steps: [
      { id: 'track', title: 'Bản nhạc bạn chọn', question: 'Bạn muốn nghe bài nào, hoặc mở danh sách quen thuộc?', inputMode: 'action', choices: ['Mở danh sách quen thuộc', 'Nhập tên bài'] },
      { id: 'impression', title: 'Cảm nhận (không bắt buộc)', question: 'Bạn muốn ghi lại cảm nhận nào không?', inputMode: 'text', optional: true },
    ] },
    { id: 'rest-offscreen', kind: 'activity', categoryId: 'rest-play', categoryLabel: 'Nghỉ và giải trí', logCategory: 'Nghỉ ngơi', title: 'Rời màn hình và nghỉ một chút', description: 'Chọn một cách nghỉ dễ làm ngay. Quay lại khi bạn muốn, không cần theo lịch cố định.', intro: 'Chỉ cần chọn một hành động nghỉ; không có countdown hay tuyên bố sức khoẻ.', output: 'Một lần nghỉ bạn đã xác nhận.', shortOutput: 'Một lần nghỉ bạn đã xác nhận.', action: 'Nghỉ một chút', firstAction: 'Chọn cách nghỉ ngay bây giờ.', timeHint: 'Không cần đặt giờ', steps: [
      { id: 'rest', title: 'Cách nghỉ', question: 'Bạn muốn đứng dậy đi vài bước hay nghỉ mắt tại chỗ?', inputMode: 'action', choices: ['Đi vài bước', 'Nghỉ mắt tại chỗ'] },
      { id: 'feeling', title: 'Sau khi nghỉ (không bắt buộc)', question: 'Bạn muốn ghi lại cảm giác sau khi nghỉ không?', inputMode: 'text', optional: true },
    ] },
  ];
  const catalog = [...activities, ...missions];
  const activityTieOrder = ['ai-preferences', 'work-next-step', 'rest-offscreen', 'ai-real-draft', 'learn-question', 'play-music'];
  const missionById = (id) => catalog.find((mission) => mission.id === id);
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
  if (state.workshop && typeof state.workshop === 'object') {
    state.workshop.answers = Array.isArray(state.workshop.answers) ? state.workshop.answers : [];
    state.workshop.drafts = state.workshop.drafts && typeof state.workshop.drafts === 'object' ? state.workshop.drafts : {};
    state.workshop.inputs = state.workshop.inputs && typeof state.workshop.inputs === 'object' ? state.workshop.inputs : {};
    state.workshop.index = Number.isInteger(state.workshop.index) ? state.workshop.index : 0;
  }
  let feedbackMission = null;
  let chosenAdjustment = null;
  let feedbackFocus = null;
  let suggestionRotation = 0;
  let queuedActivityId = null;
  let preserveQueuedOnPreviewClose = false;

  function appendText(parent, tag, cls, text) { const child = element(tag, cls, text); parent.append(child); return child; }
  function makeButton(text, cls, handler) { const button = element('button', cls, text); button.type = 'button'; button.addEventListener('click', handler); return button; }
  function appliedVariant(id) {
    const variant = state.onceOverrides[id] || state.missionOverrides[id];
    return validVariant(variant) ? variant : null;
  }
  function missionTitle(mission, variant = appliedVariant(mission.id)) { return variant ? variants[variant].title : mission.title; }
  function taskScore(task, currentState = state) { return Math.max(-2, Math.min(2, Number(currentState.missionScores?.[task.id]) || 0)); }
  function rankedActivities(currentState = state, offset = 0) {
    const ranked = activities.map((task) => ({ task, index: activityTieOrder.indexOf(task.id) }))
      .sort((a, b) => taskScore(b.task, currentState) - taskScore(a.task, currentState) || a.index - b.index)
      .map(({ task }) => task);
    const rotation = ((offset % ranked.length) + ranked.length) % ranked.length;
    return rotation ? ranked.slice(rotation).concat(ranked.slice(0, rotation)) : ranked;
  }
  function selectHomeCandidates(currentState = state, offset = 0) {
    if (currentState.session) {
      const saved = missionById(currentState.workshop?.id);
      const primary = saved ? { ...saved, resume: true, kind: 'resume', title: currentState.session.task.title } : {
        id: currentState.session.task.taskId || 'custom',
        kind: 'resume',
        categoryLabel: currentState.session.task.category,
        label: currentState.session.task.category,
        title: currentState.session.task.title,
        description: 'Phiên đang dở của bạn được giữ nguyên.',
        output: 'Tiếp tục hoặc kết thúc khi muốn.',
        shortOutput: 'Phiên đang dở',
        action: 'Tiếp tục việc đang dở',
        resume: true,
      };
      const primaryCategory = saved?.categoryId || currentState.session.task.category;
      const alternatives = [];
      for (const task of rankedActivities(currentState, offset)) {
        if (task.id === primary.id || task.categoryId === primaryCategory) continue;
        if (!alternatives.some((item) => item.categoryId === task.categoryId)) alternatives.push(task);
        if (alternatives.length === 2) break;
      }
      return { primary, alternatives };
    }
    const ranked = rankedActivities(currentState, offset);
    const primaryCategory = ranked[0]?.categoryId;
    const alternatives = [];
    for (const task of ranked.slice(1)) if (task.categoryId !== primaryCategory && !alternatives.some((item) => item.categoryId === task.categoryId)) alternatives.push(task);
    for (const task of ranked.slice(1)) if (alternatives.length < 2 && task.categoryId !== primaryCategory && !alternatives.includes(task)) alternatives.push(task);
    return { primary: ranked[0], alternatives: alternatives.slice(0, 2) };
  }
  function suggestionCard(task, priority, handler) {
    const template = $('#suggestion-card-template');
    const card = template?.content?.firstElementChild?.cloneNode(true) || element('article', 'suggestion-card');
    card.classList.add(priority === 'primary' ? 'primary-suggestion' : 'secondary-suggestion');
    card.dataset.taskId = task.id; card.dataset.priority = priority; card.dataset.kind = task.kind;
    card.dataset.category = task.categoryLabel || task.label || task.logCategory || '';
    const field = (name) => card.querySelector(`[data-field="${name}"]`);
    if (field('category')) field('category').textContent = task.categoryLabel || task.label || task.logCategory || '';
    if (field('title')) field('title').textContent = missionTitle(task);
    if (field('description')) field('description').textContent = task.description || '';
    if (field('first-action')) field('first-action').textContent = task.firstAction || task.action || '';
    if (field('output')) field('output').textContent = task.shortOutput || task.output || '';
    if (field('time-hint')) field('time-hint').textContent = task.timeHint || '';
    if (field('reason')) field('reason').textContent = task.resume ? 'Bạn còn một phiên đang dở' : (taskScore(task) > 0 ? 'Bạn đã chọn muốn thử hoạt động này nhiều hơn' : 'Một cách bắt đầu khi bạn chưa chọn việc');
    const start = card.querySelector('[data-action="start"]') || makeButton('', 'button', handler);
    start.textContent = task.resume ? 'Tiếp tục việc đang dở' : task.action;
    start.dataset.action = task.resume ? 'resume' : 'start';
    if (!start.parentElement) card.append(start);
    start.addEventListener('click', handler);
    const feedback = card.querySelector('[data-action="feedback"]');
    if (feedback) {
      if (task.resume) feedback.hidden = true;
      else feedback.addEventListener('click', () => openFeedback(task.id));
    }
    return card;
  }
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
    const primarySlot = grid.querySelector('[data-primary-slot]');
    const alternativesSlot = grid.querySelector('[data-alternatives-slot]');
    if (!primarySlot || !alternativesSlot) return;
    const selected = selectHomeCandidates(state, suggestionRotation);
    primarySlot.replaceChildren(suggestionCard(selected.primary, 'primary', () => selected.primary.resume ? (location.hash = 'work') : startMission(selected.primary.id)));
    alternativesSlot.replaceChildren(...selected.alternatives.map((task) => suggestionCard(task, 'secondary', () => openTask(task.id))));
    const sampleMount = $('#sample-missions');
    if (sampleMount) {
      sampleMount.replaceChildren();
      for (const mission of missions) sampleMount.append(suggestionCard(mission, 'secondary', () => startMission(mission.id)));
    }
    const preferences = $('#approved-preferences'); preferences.replaceChildren();
    if (state.approvedRules.length) {
      appendText(preferences, 'span', 'small-overline', 'ĐIỀU CHỈNH BẠN ĐÃ CHỌN');
      for (const id of [...new Set(state.approvedRules.map((rule) => rule.missionId))]) {
        const mission = missionById(id); if (!mission) continue;
        const latest = [...state.approvedRules].reverse().find((rule) => rule.missionId === id);
        const row = element('div', 'approved-rule'); appendText(row, 'p', '', latest.text);
        row.append(makeButton('Đặt lại', 'text-button', () => { delete state.missionOverrides[id]; delete state.onceOverrides[id]; state.missionScores[id] = 0; state.approvedRules = state.approvedRules.filter((rule) => rule.missionId !== id); save(); renderHome(); notify('Đã đặt lại ưu tiên và cách làm cho hoạt động này.'); }));
        preferences.append(row);
      }
    }
    renderSummaries();
  }
  function openActivityPicker() {
    const dialog = $('#activity-picker');
    if (!dialog) { openTask(activities[0].id); return; }
    const list = dialog.querySelector('[data-activity-list]') || dialog;
    list.replaceChildren();
    for (const category of [...new Set(activities.map((task) => task.categoryLabel))]) {
      const group = element('section', 'activity-picker-group');
      appendText(group, 'h3', 'small-overline', category);
      for (const task of activities.filter((item) => item.categoryLabel === category)) group.append(suggestionCard(task, 'secondary', () => { dialog.close(); openTask(task.id); }));
      list.append(group);
    }
    dialog.showModal();
  }
  function openTask(id) {
    const task = missionById(id); if (!task) return;
    const dialog = $('#activity-preview');
    if (!dialog) { startMission(id); return; }
    const content = dialog.querySelector('[data-preview-content]') || dialog;
    queuedActivityId = state.session ? task.id : null;
    const card = suggestionCard(task, 'primary', () => {
      if (state.session) return;
      dialog.close(); startMission(task.id);
    });
    const previewStart = card.querySelector('[data-action="start"]');
    if (previewStart) previewStart.dataset.action = 'start-preview';
    if (state.session) {
      const actions = element('div', 'activity-preview-actions');
      actions.append(
        makeButton('Để sau', 'button quiet', () => { queuedActivityId = null; dialog.close(); }),
        makeButton('Kết thúc việc đang dở trước', 'button outlined', () => {
          preserveQueuedOnPreviewClose = true;
          dialog.close();
          if (state.workshop) window.NhipWorkshop.finish();
          else window.NhipApp?.finishCurrentSession();
        }),
      );
      actions.firstElementChild.dataset.action = 'defer';
      actions.lastElementChild.dataset.action = 'finish-current';
      card.append(actions);
      const start = card.querySelector('[data-action="start-preview"]');
      if (start) { start.disabled = true; start.textContent = 'Bắt đầu sau khi kết thúc phiên hiện tại'; }
    }
    content.replaceChildren(card);
    dialog.showModal();
  }
  function startMission(id) {
    if (state.session) { location.hash = 'work'; notify('Mình giữ nguyên phiên đang làm. Bạn có thể tiếp tục hoặc kết thúc phiên đó.'); return; }
    const mission = missionById(id), variant = appliedVariant(id);
    state.finishDraft = null;
    state.workshop = { id, variant: mission.kind === 'sample' ? variant : null, index: 0, answers: [], drafts: {}, limit: mission.kind === 'sample' && variant ? variants[variant].limit : mission.steps.length, schemaVersion: mission.kind === 'activity' ? 2 : undefined, kind: mission.kind || 'sample', inputs: {}, artifact: null };
    delete state.onceOverrides[id];
    state.session = { task: { taskId: mission.id, kind: mission.kind || 'sample', categoryLabel: mission.categoryLabel || mission.label, title: missionTitle(mission, variant), category: mission.logCategory || 'Làm việc', minutes: 20 }, elapsed: 0, startedAt: Date.now(), time: clockTime() };
    save(); renderSession(); location.hash = 'work'; renderWork();
  }
  function consumeQueuedActivity() {
    const queued = queuedActivityId;
    queuedActivityId = null;
    return queued;
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
    if (!mission || !Array.isArray(mission.steps)) {
      $('#work-feedback').hidden = true;
      appendText(content, 'span', 'step-overline', 'PHIÊN ĐÃ LƯU');
      appendText(content, 'h2', 'step-title', 'Hoạt động này không còn trong catalog.');
      appendText(content, 'p', 'field-hint', 'Dữ liệu phiên vẫn được giữ nguyên. Bạn có thể kết thúc để ghi nhận phần đã làm.');
      $('#work-output').textContent = 'Kết quả do bạn tự ghi nhận khi kết thúc.';
      return;
    }
    journey.limit = Math.max(1, Math.min(mission.steps.length, Number(journey.limit) || mission.steps.length));
    journey.index = Math.max(0, Math.min(journey.limit, journey.index));
    $('#work-overline').textContent = mission.label || mission.categoryLabel;
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
    $('#intent-preview').textContent = intent === 'more' ? 'Tăng ưu tiên hoạt động này một chút. Vẫn giữ các lựa chọn khác.' : intent === 'less' ? 'Giảm ưu tiên hoạt động này một chút. Vẫn giữ cơ hội thử lại.' : 'Giữ nguyên ưu tiên. Chưa suy ra sở thích mới từ phiên này.';
  }
  function finish() {
    if (!state.workshop || !state.session) return;
    feedbackFocus = document.activeElement;
    state.session.elapsed = sessionElapsed(); state.session.startedAt = null; save(); renderSession();
    $('#finish-form').reset();
    const count = state.workshop.answers.filter(Boolean).length;
    const mission = missionById(state.workshop.id);
    const draft = state.finishDraft;
    const fallback = mission?.kind === 'activity'
      ? (state.workshop.artifact?.text || (count ? state.workshop.answers.filter(Boolean).map((answer) => `${answer.title}: ${answer.text}`).join('\n') : `Đã bắt đầu “${state.session.task.title}”, chưa chốt kết quả cụ thể.`))
      : (count ? `Đã xác nhận ${count} nhận xét trong nhiệm vụ “${state.session.task.title}”.` : 'Đã thử nhiệm vụ, chưa xác nhận nhận xét nào.');
    $('#finish-result').value = draft?.result ?? fallback;
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
    const id = crypto.randomUUID(), journey = state.workshop, mission = missionById(journey.id);
    const intent = $('#finish-intent').value;
    const contributions = [...$('#finish-form').querySelectorAll('input[name="contribution"]:checked')].map((input) => input.value);
    const followup = $('#intent-preview').textContent;
    const logCategory = state.session.task.category || 'Làm việc';
    state.entries.push({ id, title: state.session.task.title, category: logCategory, minutes, time: state.session.time, date: dayKey(), outcome: result, support: $('#finish-support').value, sample: mission?.kind === 'sample' });
    state.workshopHistory.push({ id, missionId: journey.id, title: state.session.task.title, date: dayKey(), result, followup, contributions, feedback: $('#finish-feedback').value.trim(), answers: journey.answers, artifact: journey.artifact || null, kind: journey.kind, categoryLabel: state.session.task.categoryLabel });
    if (intent !== 'neutral') {
      const oldScore = Number(state.missionScores[journey.id]) || 0;
      state.missionScores[journey.id] = Math.max(-2, Math.min(2, oldScore + (intent === 'more' ? 1 : -1)));
      state.approvedRules.push({ missionId: journey.id, type: 'priority', text: followup, reason: $('#finish-feedback').value.trim() });
    }
    const queued = queuedActivityId; queuedActivityId = null;
    state.session = null; state.workshop = null; state.finishDraft = null; save(); renderSession(); renderRecords(); renderHome(); $('#finish-dialog').close();
    if (queued) openTask(queued); else location.hash = 'review';
    notify('Đã lưu kết quả bạn xác nhận.');
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
  $('#rotate-suggestions')?.addEventListener('click', () => { suggestionRotation = (suggestionRotation + 1) % activities.length; renderHome(); });
  $('#activity-picker-open')?.addEventListener('click', openActivityPicker);
  $('#activity-picker [data-action="close-picker"]')?.addEventListener('click', () => $('#activity-picker').close());
  $('#activity-preview [data-action="close-preview"]')?.addEventListener('click', () => { queuedActivityId = null; $('#activity-preview').close(); });
  $('#activity-preview')?.addEventListener('close', () => {
    if (!preserveQueuedOnPreviewClose) queuedActivityId = null;
    preserveQueuedOnPreviewClose = false;
  });
  $('#activity-preview')?.addEventListener('cancel', () => {
    if (!preserveQueuedOnPreviewClose) queuedActivityId = null;
  });
  window.NhipWorkshop = { renderHome, renderWork, finish, missions, activities, catalog, missionById, activityById: (id) => activities.find((activity) => activity.id === id), selectHomeCandidates, startMission, openTask, consumeQueuedActivity };
  renderHome(); renderSession();
})();
