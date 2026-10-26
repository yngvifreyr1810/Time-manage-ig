'use strict';

const $ = (selector) => document.querySelector(selector);
const STORE = 'nhip-prototype-v1';
const timeZone = 'Asia/Ho_Chi_Minh';
const dayKey = (date = new Date()) => new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
const clockTime = (date = new Date()) => new Intl.DateTimeFormat('en-GB', { timeZone, hour: '2-digit', minute: '2-digit', hour12: false }).format(date);
const today = dayKey();
const categories = {
  'Học hỏi': { key: 'study', icon: 'book' },
  'Làm việc': { key: 'work', icon: 'edit' },
  'Giải trí': { key: 'play', icon: 'headphones' },
  'Nghỉ ngơi': { key: 'rest', icon: 'leaf' },
};
const supports = { unspecified: '', independent: 'Tự thực hành', assisted: 'Có AI hỗ trợ', na: '' };
const suggestions = [{ title: 'Hoạt động tự chọn', category: 'Làm việc', minutes: 20 }];
const sampleEntries = () => [
  { id: 'sample-reading', title: 'Đọc một chương sách', category: 'Học hỏi', minutes: 40, time: '09:00', date: today, outcome: 'Ghi lại 3 ý chính bằng lời của mình.', support: 'independent', sample: true },
  { id: 'sample-walk', title: 'Đi bộ, đổi một chút không khí', category: 'Nghỉ ngơi', minutes: 20, time: '10:15', date: today, outcome: '', support: 'na', sample: true },
  { id: 'sample-music', title: 'Nghe một album yêu thích', category: 'Giải trí', minutes: 45, time: '11:00', date: today, outcome: '', support: 'na', sample: true },
];
let storageAvailable = true;
let state;
try {
  const saved = JSON.parse(localStorage.getItem(STORE));
  state = saved && saved.version === 1 && Array.isArray(saved.entries) ? saved : null;
} catch { storageAvailable = false; }
if (!state) state = { version: 1, entries: sampleEntries(), suggestionIndex: 0, custom: null, session: null, theme: matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light' };
state.entries = state.entries.filter((entry) => entry && typeof entry.id === 'string' && typeof entry.title === 'string' && entry.title.trim() && categories[entry.category] && Number.isInteger(entry.minutes) && entry.minutes >= 1 && entry.minutes <= 1440 && /^\d{2}:\d{2}$/.test(entry.time) && typeof entry.date === 'string').map((entry) => ({ ...entry, support: Object.hasOwn(supports, entry.support) ? entry.support : 'unspecified', outcome: typeof entry.outcome === 'string' ? entry.outcome : '' }));
state.suggestionIndex = Number.isInteger(state.suggestionIndex) ? ((state.suggestionIndex % suggestions.length) + suggestions.length) % suggestions.length : 0;
if (state.custom && (typeof state.custom.title !== 'string' || !categories[state.custom.category] || !Number.isFinite(state.custom.minutes))) state.custom = null;
if (state.session && (!state.session.task || typeof state.session.task.title !== 'string' || !categories[state.session.task.category] || !Number.isFinite(state.session.elapsed) || (state.session.startedAt !== null && !Number.isFinite(state.session.startedAt)))) state.session = null;
let editingId = null;
let pendingSession = false;
let previousFocus = null;
let toastTimeout;

function notify(message) {
  $('#toast').textContent = message;
  $('#toast').classList.add('visible');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => $('#toast').classList.remove('visible'), 4000);
}
function save() {
  if (!storageAvailable) return;
  try { localStorage.setItem(STORE, JSON.stringify(state)); }
  catch { storageAvailable = false; notify('Trình duyệt không cho lưu. Bạn vẫn có thể thử trong phiên này.'); }
}
function icon(name, className = 'icon') {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', className);
  svg.setAttribute('aria-hidden', 'true');
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttribute('href', '#i-' + name);
  svg.append(use);
  return svg;
}
function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}
function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return [hours ? `${hours} giờ` : '', rest ? `${rest} phút` : ''].filter(Boolean).join(' ') || '0 phút';
}
function todayEntries() {
  return state.entries.filter((entry) => entry.date === dayKey()).sort((a, b) => a.time.localeCompare(b.time));
}
function applyTheme() {
  const dark = state.theme === 'dark';
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  const label = dark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối';
  $('#theme-toggle').setAttribute('aria-label', label);
  $('#theme-toggle > span').textContent = dark ? 'Chế độ sáng' : 'Chế độ tối';
  $('#theme-toggle use').setAttribute('href', dark ? '#i-sun' : '#i-moon');
  $('#mobile-theme').setAttribute('aria-label', label);
  $('#mobile-theme use').setAttribute('href', dark ? '#i-sun' : '#i-moon');
  $('meta[name="theme-color"]').content = dark ? '#14131f' : '#f8f7fc';
}
function toggleTheme() { state.theme = state.theme === 'dark' ? 'light' : 'dark'; applyTheme(); save(); }
function currentTask() { return state.custom || suggestions[state.suggestionIndex]; }
function renderSuggestion() { window.NhipWorkshop?.renderHome(); }
function renderBreakdown(barSelector, listSelector, entries) {
  const bar = $(barSelector);
  const list = $(listSelector);
  bar.replaceChildren(); list.replaceChildren();
  const total = entries.reduce((sum, entry) => sum + entry.minutes, 0);
  for (const [name, category] of Object.entries(categories)) {
    const minutes = entries.filter((entry) => entry.category === name).reduce((sum, entry) => sum + entry.minutes, 0);
    if (!minutes) continue;
    const segment = element('span', `time-segment color-${category.key}`);
    segment.style.width = `${minutes / total * 100}%`;
    segment.title = `${name}: ${formatDuration(minutes)}`;
    segment.setAttribute('aria-hidden', 'true');
    bar.append(segment);
    const row = element('div', 'breakdown-row');
    row.append(element('i', 'color-' + category.key), element('span', '', name), element('strong', '', formatDuration(minutes)));
    list.append(row);
  }
  if (!total) list.append(element('p', 'field-hint', 'Chưa có thời gian được ghi nhận.'));
}
function renderEntries(selector, entries, detailed = false) {
  const list = $(selector);
  list.replaceChildren();
  if (!entries.length) { list.append(element('p', 'empty-state', 'Chưa có hoạt động nào hôm nay. Bạn có thể ghi lại bất cứ lúc nào.')); return; }
  for (const entry of entries) {
    const category = categories[entry.category];
    const button = element('button', 'entry');
    button.type = 'button';
    button.setAttribute('aria-label', `Sửa ${entry.title}, ${formatDuration(entry.minutes)}`);
    const entryIcon = element('span', 'entry-icon ' + category.key);
    entryIcon.append(icon(category.icon));
    const copy = element('span', 'entry-copy');
    copy.append(element('span', 'entry-title', entry.title));
    const metadata = [entry.category, supports[entry.support], entry.sample ? 'Mẫu' : ''].filter(Boolean).join(' · ');
    copy.append(element('span', 'entry-meta', metadata));
    if (detailed && entry.outcome) copy.append(element('span', 'entry-outcome', entry.outcome));
    button.append(element('span', 'entry-time', entry.time), entryIcon, copy, element('span', 'entry-duration', formatDuration(entry.minutes)));
    button.addEventListener('click', () => openEntry(entry));
    list.append(button);
  }
}
function renderRecords() {
  const entries = todayEntries();
  const total = entries.reduce((sum, entry) => sum + entry.minutes, 0);
  const hours = Math.floor(total / 60), minutes = total % 60;
  const timeTotal = $('#today-total');
  timeTotal.replaceChildren();
  if (hours) timeTotal.append(document.createTextNode(String(hours)), element('span', '', 'giờ'));
  timeTotal.append(document.createTextNode(String(minutes)), element('span', '', 'phút'));
  $('#summary-caption').textContent = `đã ghi nhận qua ${entries.length} hoạt động`;
  $('.summary-card .sample-label').textContent = entries.some((entry) => entry.sample) ? 'Có dữ liệu mẫu · bạn có thể thay đổi' : 'Bản ghi trên trình duyệt này';
  $('#review-total').textContent = formatDuration(total);
  $('#review-count').textContent = String(entries.length);
  const outcomes = entries.filter((entry) => entry.outcome.trim());
  $('#review-outcomes').textContent = String(outcomes.length);
  renderBreakdown('#today-bar', '#today-breakdown', entries);
  renderBreakdown('#review-bar', '#review-breakdown', entries);
  renderEntries('#recent-entries', entries.slice(-3));
  renderEntries('#all-entries', entries, true);
  $('#review-insight').textContent = !entries.length ? 'Chưa có đủ ghi nhận để nhận xét. Một bản ghi nhỏ là điểm bắt đầu.' : outcomes.length ? `Bạn đã ghi lại ${outcomes.length} kết quả trong ${entries.length} hoạt động hôm nay. Lần nhìn lại tới, bạn có thể chọn một kết quả mình muốn tiếp tục phát triển.` : `Bạn đã ghi ${formatDuration(total)} qua ${entries.length} hoạt động. Bạn có thể bổ sung điều đã làm được khi thấy cần; thời lượng chưa nói hết ý nghĩa của một ngày.`;
}
function route() {
  const requested = location.hash.slice(1);
  const view = ['next', 'log', 'review', 'work'].includes(requested) && (requested !== 'work' || state.session) ? requested : 'next';
  document.querySelectorAll('.view').forEach((section) => { section.hidden = section.id !== 'view-' + view; });
  document.querySelectorAll('.nav-link').forEach((link) => {
    const active = link.dataset.view === (view === 'work' ? 'next' : view);
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
  });
  $('#page-label').textContent = { next: 'Khám phá', log: 'Ghi nhanh', review: 'Nhìn lại', work: 'Cùng làm' }[view];
  document.title = `${$('#page-label').textContent} — Nhịp`;
  if (view === 'next') renderSuggestion();
  if (document.readyState === 'complete') { window.scrollTo(0, 0); $('#main').focus({ preventScroll: true }); }
}
function openEntry(entry = {}, options = {}) {
  editingId = entry.id || null;
  pendingSession = !!options.fromSession;
  previousFocus = document.activeElement;
  $('#entry-form').reset();
  $('#entry-error').textContent = '';
  $('#dialog-title').textContent = editingId ? 'Điều chỉnh bản ghi' : 'Xem lại trước khi lưu';
  $('#entry-title').value = entry.title || '';
  $('#entry-category').value = categories[entry.category] ? entry.category : 'Học hỏi';
  $('#entry-minutes').value = entry.minutes || '';
  $('#entry-time').value = entry.time || clockTime();
  $('#entry-outcome').value = entry.outcome || '';
  $('#entry-support').value = Object.hasOwn(supports, entry.support) ? entry.support : 'unspecified';
  $('#delete-entry').hidden = !editingId;
  $('#entry-dialog').showModal();
  $('#entry-title').focus();
}
function closeEntry() { $('#entry-dialog').close(); }
function sessionElapsed() {
  const session = state.session;
  return session ? session.elapsed + (session.startedAt === null ? 0 : Math.max(0, Date.now() - session.startedAt)) : 0;
}
function renderTimer() {
  if (!state.session) return;
  const seconds = Math.floor(sessionElapsed() / 1000);
  const hours = Math.floor(seconds / 3600);
  $('#session-clock').textContent = (hours ? `${String(hours).padStart(2, '0')}:` : '') + `${String(Math.floor(seconds / 60) % 60).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}
function renderSession() {
  const session = state.session;
  $('#resume-strip').hidden = true;
  $('#session-card').hidden = !session;
  if (!session) return;
  $('#session-title').textContent = session.task.title;
  const workMode = document.querySelector('.work-mode span');
  if (workMode) workMode.textContent = session.task.kind === 'sample' ? '· tình huống mẫu' : '';
  const paused = session.startedAt === null;
  const pause = $('#pause-session');
  pause.replaceChildren(icon(paused ? 'play' : 'pause'), document.createTextNode(paused ? 'Tiếp tục' : 'Tạm dừng'));
  $('#session-note').textContent = paused ? 'Đang tạm dừng. Bạn có thể tiếp tục hoặc kết thúc khi muốn.' : 'Bạn có thể kết thúc bất cứ lúc nào. Thời gian chỉ là một phần câu chuyện.';
  renderTimer();
  window.NhipWorkshop?.renderWork();
}

document.querySelectorAll('svg.icon').forEach((svg) => svg.setAttribute('aria-hidden', 'true'));
$('#date-label').textContent = new Intl.DateTimeFormat('vi-VN', { timeZone, weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
$('#theme-toggle').addEventListener('click', toggleTheme);
$('#mobile-theme').addEventListener('click', toggleTheme);
$('#change-task')?.addEventListener('click', () => {
  state.custom = null;
  state.suggestionIndex = (state.suggestionIndex + 1) % suggestions.length;
  renderSuggestion(); save(); notify('Đã đổi gợi ý. Chọn điều phù hợp với bạn lúc này.');
});
$('#choose-task').addEventListener('click', () => { previousFocus = document.activeElement; $('#task-form').reset(); $('#task-dialog').showModal(); });
$('#close-task-dialog').addEventListener('click', () => $('#task-dialog').close());
$('#task-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const title = $('#custom-title').value.trim(), minutes = Number($('#custom-minutes').value);
  if (!title || !Number.isInteger(minutes) || minutes < 1 || minutes > 1440) return;
  state.custom = { title, minutes, category: $('#custom-category').value, description: 'Việc do bạn tự chọn. Bắt đầu từ một phần vừa sức và điều chỉnh khi cần.', effort: 'Bạn tự chọn', reason: 'Bạn quyết định điều gì có ý nghĩa với mình lúc này.' };
  if (state.session) { notify('Phiên hiện tại vẫn được giữ. Hãy kết thúc phiên trước khi bắt đầu việc khác.'); return; }
  state.workshop = null;
  state.session = { task: { ...state.custom }, startedAt: Date.now(), elapsed: 0, time: clockTime() };
  save(); renderSession(); $('#task-dialog').close(); location.hash = 'work'; notify('Đã bắt đầu việc bạn chọn.');
});
$('#start-task')?.addEventListener('click', () => {
  if (state.session) return;
  state.session = { task: { ...currentTask() }, startedAt: Date.now(), elapsed: 0, time: clockTime() };
  save(); renderSession(); $('#pause-session').focus(); notify('Đã bắt đầu. Cứ theo nhịp của bạn.');
});
$('#pause-session').addEventListener('click', () => {
  if (!state.session) return;
  if (state.session.startedAt === null) state.session.startedAt = Date.now();
  else { state.session.elapsed = sessionElapsed(); state.session.startedAt = null; }
  save(); renderSession();
});
$('#finish-session').addEventListener('click', () => {
  if (!state.session) return;
  if (state.workshop && window.NhipWorkshop) { window.NhipWorkshop.finish(); return; }
  state.session.elapsed = sessionElapsed(); state.session.startedAt = null; save(); renderSession();
  openEntry({ title: state.session.task.title, category: state.session.task.category, minutes: Math.max(1, Math.round(state.session.elapsed / 60000)), time: state.session.time }, { fromSession: true });
});
window.NhipApp = {
  finishCurrentSession() {
    if (!state.session) return;
    state.session.elapsed = sessionElapsed(); state.session.startedAt = null; save(); renderSession();
    openEntry({ title: state.session.task.title, category: state.session.task.category, minutes: Math.max(1, Math.round(state.session.elapsed / 60000)), time: state.session.time }, { fromSession: true });
  },
};
$('#prepare-log').addEventListener('click', () => {
  const text = $('#quick-text').value.trim();
  $('#quick-error').textContent = '';
  if (!text) { $('#quick-error').textContent = 'Bạn kể một chút về hoạt động trước nhé, hoặc chọn một nhóm bên dưới.'; $('#quick-text').focus(); return; }
  const hourMatch = text.match(/(\d+)\s*(?:giờ|gio|h)\s*(?:(\d+)\s*(?:phút|phut|p|m)?)?/i);
  const minuteMatch = text.match(/(\d+)\s*(?:phút|phut|p\b|m\b)/i);
  const minutes = hourMatch ? Number(hourMatch[1]) * 60 + Number(hourMatch[2] || 0) : minuteMatch ? Number(minuteMatch[1]) : '';
  let category = 'Học hỏi';
  if (/ngủ|nghỉ|đi bộ|thư giãn/i.test(text)) category = 'Nghỉ ngơi';
  else if (/game|chơi|nhạc|phim|giải trí/i.test(text)) category = 'Giải trí';
  else if (/làm việc|báo cáo|họp|công việc/i.test(text)) category = 'Làm việc';
  openEntry({ title: text.slice(0, 200), minutes, category });
});
document.querySelectorAll('[data-quick-category]').forEach((button) => button.addEventListener('click', () => openEntry({ category: button.dataset.quickCategory })));
document.querySelectorAll('[data-open-log]').forEach((button) => button.addEventListener('click', () => openEntry()));
$('#close-dialog').addEventListener('click', closeEntry);
$('#cancel-dialog').addEventListener('click', closeEntry);
$('#entry-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const title = $('#entry-title').value.trim(), minutes = Number($('#entry-minutes').value), time = $('#entry-time').value;
  if (!title || !Number.isInteger(minutes) || minutes < 1 || minutes > 1440 || !time) { $('#entry-error').textContent = 'Nhập tên hoạt động, giờ bắt đầu và thời lượng từ 1 đến 1.440 phút.'; return; }
  const old = state.entries.find((entry) => entry.id === editingId);
  const entry = { id: editingId || (globalThis.crypto?.randomUUID?.() || String(Date.now()) + Math.random().toString(36).slice(2)), title, minutes, time, date: old?.date || dayKey(), category: $('#entry-category').value, outcome: $('#entry-outcome').value.trim(), support: $('#entry-support').value, sample: false };
  if (editingId && Array.isArray(state.workshopHistory)) state.workshopHistory = state.workshopHistory.map((item) => item.id === editingId ? { ...item, title: entry.title, result: entry.outcome } : item);
  if (editingId) state.entries = state.entries.map((item) => item.id === editingId ? entry : item);
  else state.entries.push(entry);
  if (pendingSession) {
    state.session = null; state.workshop = null; renderSession();
    const queued = window.NhipWorkshop?.consumeQueuedActivity?.();
    if (queued) { save(); closeEntry(); window.NhipWorkshop.openTask(queued); }
    else location.hash = 'review';
  }
  save(); renderRecords(); renderSuggestion(); closeEntry(); $('#quick-text').value = ''; notify('Đã lưu bản ghi trên trình duyệt này.');
});
$('#delete-entry').addEventListener('click', () => {
  if (!editingId) return;
  state.entries = state.entries.filter((entry) => entry.id !== editingId);
  if (Array.isArray(state.workshopHistory)) state.workshopHistory = state.workshopHistory.filter((item) => item.id !== editingId);
  save(); renderRecords(); renderSuggestion(); closeEntry(); notify('Đã xoá bản ghi.');
});
for (const selector of ['#entry-dialog', '#task-dialog']) {
  $(selector).addEventListener('close', () => {
    if (selector === '#entry-dialog' && pendingSession && window.NhipWorkshop) window.NhipWorkshop.consumeQueuedActivity?.();
    pendingSession = false;
    if (previousFocus?.isConnected && !previousFocus.closest('[hidden]')) previousFocus.focus();
    else $('#main').focus({ preventScroll: true });
  });
}
window.addEventListener('hashchange', route);
document.addEventListener('visibilitychange', () => { if (!document.hidden) renderTimer(); });
applyTheme(); renderSuggestion(); renderSession(); renderRecords(); route();
setInterval(renderTimer, 1000);
if (!storageAvailable) notify('Không thể lưu trên trình duyệt này. Bạn vẫn có thể thử giao diện trong phiên hiện tại.');
